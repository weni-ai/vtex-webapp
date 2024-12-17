import getEnv from '../env';
import { FBLoginResponse } from '../../interfaces/Facebook';

declare global {
    interface Window {
        fbq?: (action: string, event: string, params: Record<string, unknown>) => void;
        fbAsyncInit?: () => void;
        configs?: Record<string, string>;
    }
}

export function initFacebookSdk(appId: string, loginCallback: () => void): void {
    // Wait for Facebook SDK to initialize before starting the Vue app
    window.fbAsyncInit = function (): void {
        // JavaScript SDK configuration and setup
        FB.init({
            appId, // Facebook App ID
            xfbml: true, // Parse social plugins on this page
            version: 'v18.0', // Graph API version
        });

        // Call login code after init
        loginCallback();
    };

    // Search for the current loaded SDK and remove it
    (function (d, s, id): void {
        const existingScript = d.getElementById(id);
        if (existingScript) existingScript.remove();
        if (typeof FB !== 'undefined') {
            FB = null!;
        }
    })(document, 'script', 'facebook-jssdk');

    // Load the JavaScript SDK asynchronously
    (function (d, s, id): void {
        const js: HTMLScriptElement = d.createElement(s) as HTMLScriptElement;;
        const fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk.js';
        fjs.parentNode?.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
}

export function startFacebookLogin(): void {
    const fbAppId = getEnv('VITE_APP_WHATSAPP_FACEBOOK_APP_ID');
    const configId = getEnv('VITE_APP_WHATSAPP_FACEBOOK_APP_CONFIG_ID');
    console.log(fbAppId)

    if (!fbAppId) {
        return;
    }

    const loginCallback = (): void => {

        const sessionInfoListener = (event: MessageEvent): void => {
            if (!event.origin) {
                console.log("Session info listener: Data doesn't have an origin", event.origin);
                return;
            }

            // Ensure the data is coming from facebook.com
            if (!event.origin.endsWith('facebook.com')) {
                console.log('Session info listener: Data is not coming from facebook.com', event.origin);
                return;
            }

            try {
                const data = JSON.parse(event.data);
                if (data.type === 'WA_EMBEDDED_SIGNUP') {
                    if (data.event === 'FINISH') {
                        const { phone_number_id, waba_id } = data.data;
                        console.log('PHONE ID: ', phone_number_id, 'WABA ID: ', waba_id)
                    } else if (data.event === 'ERROR') {
                        const { error_message } = data.data;
                        console.log(
                            'Session info listener: Error during the Embedded Signup flow.',
                            error_message
                        );
                    } else {
                        const { current_step } = data.data;
                        console.log(
                            'Session info listener: User cancelled login or did not fully authorize.',
                            current_step
                        );
                    }
                }
            } catch {
                console.log('Non JSON Response', event.data);
            }
        };

        window.addEventListener('message', sessionInfoListener);

        if (typeof window.fbq !== 'undefined') {
            window.fbq('trackCustom', 'WhatsAppOnboardingStart', {
                appId: fbAppId,
                feature: 'whatsapp_embedded_signup',
            });
        }

        FB.login(
            (response: FBLoginResponse): void => {
                if (response.authResponse) {
                    const code = response.authResponse.code;
                    console.log("Code: ", code)
                } else {
                    console.log('Login Callback: User cancelled login or did not fully authorize');
                }
            },
            {
                config_id: configId ?? '',
                response_type: 'code',
                override_default_response_type: true,
                extras: {
                    sessionInfoVersion: 2,
                },
            }
        );
    };

    initFacebookSdk(fbAppId, loginCallback);
}
