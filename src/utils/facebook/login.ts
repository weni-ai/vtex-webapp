/* eslint-disable @typescript-eslint/no-explicit-any */
import getEnv from "../env";
import { VTEXFetch } from "../VTEXFetch";

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

export function startFacebookLogin(project_uuid: string, token: string) {
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

                    createChannel(code, project_uuid, wabaId, phoneId, token);
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

async function createChannel(code: string, project_uuid: string, wabaId: string, phoneId: string, token: string) {

    const data = {
        waba_id: wabaId,
        phone_number_id: phoneId,
        project_uuid: project_uuid,
        auth_code: code,
    };

    console.log("Creating channel with data:", data);

    await VTEXFetch(`/_v/whatsapp-integration?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((response) => {
        console.log('Whatsapp registered', response)
      }).catch((error) => {
        console.error('Error:', error);
      });
}
