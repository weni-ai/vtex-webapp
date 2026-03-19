import { createChannel, fetchPreVerifiedPhoneIds } from "../../services/channel.service";
import type { FBLoginOptions } from "../../interfaces/Facebook";
import getEnv from "../env";
import { setWppLoading } from "../../store/projectSlice";
import store from "../../store/provider.store";

const LOGIN_TIMEOUT_MS = 10 * 60 * 1000;

function initFacebookSDK(appId: string, loginCallback: () => Promise<void>) {
    const existingScript = document.getElementById("facebook-jssdk");
    if (existingScript) {
        console.log("Facebook SDK already loaded, removing it.");
        existingScript.remove();
    }

    window.fbAsyncInit = function () {
        FB.init({
            appId,
            xfbml: true,
            version: "v18.0",
        });

        loginCallback().catch((error) => {
            console.error("Facebook login callback failed:", error);
            resetLoginState();
        });
    };

    (function (id) {
        if (document.getElementById(id)) {
            console.log("Facebook SDK already loaded, returning.");
            return;
        }

        const js = document.createElement("script");
        js.setAttribute("id", id);
        js.setAttribute("src", "https://connect.facebook.net/en_US/sdk.js");
        js.async = true;
        js.defer = true;

        js.onload = function () {
            console.log("Facebook SDK loaded successfully.");
        };

        js.onerror = function () {
            console.error("Failed to load Facebook SDK.");
        };

        document.head.appendChild(js);
    })("facebook-jssdk");
}

let activeSessionInfoListener: ((event: MessageEvent) => void) | null = null;
let loginInProgress = false;
let loginTimeoutId: ReturnType<typeof setTimeout> | null = null;

function cleanupSessionInfoListener() {
    if (activeSessionInfoListener) {
        window.removeEventListener("message", activeSessionInfoListener);
        activeSessionInfoListener = null;
    }
}

function clearLoginTimeout() {
    if (loginTimeoutId !== null) {
        clearTimeout(loginTimeoutId);
        loginTimeoutId = null;
    }
}

function resetLoginState() {
    cleanupSessionInfoListener();
    clearLoginTimeout();
    loginInProgress = false;
    store.dispatch(setWppLoading(false));
}

export function startFacebookLogin(project_uuid: string) {
    const fbAppId = getEnv("VITE_APP_FACEBOOK_APP_ID");
    const configId = getEnv("VITE_APP_WHATSAPP_FACEBOOK_APP_ID");

    if (!fbAppId) {
        console.error("Facebook App ID is missing.");
        return;
    }

    if (loginInProgress) {
        console.warn("Facebook login already in progress.");
        return;
    }

    loginInProgress = true;
    cleanupSessionInfoListener();

    const loginCallback = async () => {
        console.log("Facebook SDK is initialized.");
        let wabaId = '';
        let phoneId = '';

        const sessionInfoListener = (event: MessageEvent) => {
            if (!event.origin || !event.origin.endsWith("facebook.com")) {
                return;
            }

            try {
                const data = JSON.parse(event.data);
                if (data.type === "WA_EMBEDDED_SIGNUP") {
                    if (data.event === "FINISH") {
                        const { phone_number_id, waba_id } = data.data;
                        wabaId = waba_id;
                        phoneId = phone_number_id;
                        console.log("Embedded Signup Finished");
                    } else if (data.event === "ERROR") {
                        console.error("Embedded Signup Error");
                    } else {
                        console.warn("Embedded Signup Canceled");
                    }
                }
            } catch (error) {
                console.error("Error parsing event data:", error);
            }
        };

        activeSessionInfoListener = sessionInfoListener;
        window.addEventListener("message", sessionInfoListener);

        store.dispatch(setWppLoading(true));
        const preVerifiedIds = await fetchPreVerifiedPhoneIds();

        const loginOptions: FBLoginOptions = {
            config_id: configId ?? "",
            response_type: "code",
            override_default_response_type: true,
            extras: {
                featureType: "whatsapp_business_app_onboarding",
                sessionInfoVersion: 3,
                features: [
                    {
                        name: "marketing_messages_lite",
                    },
                ],
                setup: {
                    preVerifiedPhone: {
                        ids: preVerifiedIds.length > 0 ? preVerifiedIds : [""],
                    },
                },
                version: "v3",
            },
        };

        loginTimeoutId = setTimeout(() => {
            console.warn("Facebook login timed out, cleaning up.");
            resetLoginState();
        }, LOGIN_TIMEOUT_MS);

        FB.login(
            async (response) => {
                clearLoginTimeout();
                cleanupSessionInfoListener();

                try {
                    if (response.authResponse) {
                        const code = response.authResponse.code;
                        console.log("Login Successful.");
                        await createChannel(code, project_uuid, wabaId, phoneId);
                    } else {
                        console.error("Login canceled or not fully authorized.");
                    }
                } catch (error) {
                    console.error("Failed to create channel:", error);
                } finally {
                    loginInProgress = false;
                    store.dispatch(setWppLoading(false));
                }
            },
            loginOptions
        );
    };

    initFacebookSDK(fbAppId, loginCallback);
}
