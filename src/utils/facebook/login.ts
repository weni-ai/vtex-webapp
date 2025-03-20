import { createChannel } from "../../services/channel.service";
import getEnv from "../env";

function initFacebookSDK(appId: string, loginCallback: () => void) {
    const existingScript = document.getElementById("facebook-jssdk");
    if (existingScript) {
        existingScript.remove();
    }

    if (window.FB) {
        delete window.FB;
    }
    
    window.fbAsyncInit = function () {
        FB.init({
            appId,
            xfbml: true,
            version: "v18.0",
        });

        loginCallback();
    };

    (function (id) {
        const script = document.getElementById(id);
        if (script) script.remove();
    })("facebook-jssdk");

    (function (id) {
        if (document.getElementById(id)) return;

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

export function startFacebookLogin(project_uuid: string) {
    const fbAppId = getEnv("VITE_APP_FACEBOOK_APP_ID");
    const configId = getEnv("VITE_APP_WHATSAPP_FACEBOOK_APP_ID");

    if (!fbAppId) {
        console.error("Facebook App ID is missing.");
        return;
    }

    const loginCallback = () => {
        console.log("Facebook SDK is initialized.");
        let wabaId = '';
        let phoneId = '';

        const sessionInfoListener = (event: MessageEvent) => {
            if (!event.origin || !event.origin.endsWith("facebook.com")) {
                console.error("Invalid event origin:", event.origin);
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

        window.addEventListener("message", sessionInfoListener);

        FB.login(
            (response) => {
                if (response.authResponse) {
                    const code = response.authResponse.code;
                    console.log("Login Successful.");
                    createChannel(code, project_uuid, wabaId, phoneId);
                } else {
                    console.error("Login canceled or not fully authorized.");
                }
            },
            {
                config_id: configId ?? "",
                response_type: "code",
                override_default_response_type: true,
                extras: {
                    sessionInfoVersion: 2,
                },
            }
        );
    };

    initFacebookSDK(fbAppId, loginCallback);
}


