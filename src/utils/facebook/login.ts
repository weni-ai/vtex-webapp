/* eslint-disable @typescript-eslint/no-explicit-any */
import getEnv from "../env";

function initFacebookSDK(appId: string, loginCallback: () => void) {
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
    const fbAppId = getEnv("VITE_APP_WHATSAPP_FACEBOOK_APP_ID");
    const configId = getEnv("VITE_APP_WHATSAPP_FACEBOOK_APP_CONFIG_ID");

    if (!fbAppId) {
        console.error("Facebook App ID is missing.");
        return;
    }

    const loginCallback = () => {
        console.log("Facebook SDK is initialized.");

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
                        console.log("Embedded Signup Finished:", { phone_number_id, waba_id });
                    } else if (data.event === "ERROR") {
                        console.error("Embedded Signup Error:", data.data.error_message);
                    } else {
                        console.warn("Embedded Signup Canceled:", data.data.current_step);
                    }
                }
            } catch (error) {
                console.error("Error parsing event data:", error);
            }
        };

        window.addEventListener("message", sessionInfoListener);

        FB.login(
            (response: any) => {
                if (response.authResponse) {
                    const code = response.authResponse.code;
                    console.log("Login Successful. Auth Code:", code);

                    createChannel(code, project_uuid);
                } else {
                    console.error("Login canceled or not fully authorized.");
                }
            },
            {
                config_id: configId,
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

async function createChannel(code: string, project_uuid: string) {
    const phoneNumberId = "phone_number_id_placeholder";
    const wabaId = "waba_id_placeholder";

    const data = {
        waba_id: wabaId,
        phone_number_id: phoneNumberId,
        project_uuid: project_uuid,
        auth_code: code,
    };

    console.log("Creating channel with data:", data);
    // const res = await fetch("/api/configure-phone-number", {
    //     method: "POST",
    //     body: JSON.stringify(data),
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    // });

    // if (!res.ok) {
    //     console.error("Failed to create channel:", await res.json());
    // } else {
    //     console.log("Channel created successfully:", await res.json());
    // }
}
