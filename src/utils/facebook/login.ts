import getEnv from "../env";

function initFacebookSDK({
    appId,
    whenFacebookIsAvailable,
}: {
    appId: string;
    whenFacebookIsAvailable: () => void;
}) {
    window.fbAsyncInit = function () {
        FB.init({
            appId,
            xfbml: true,
            version: 'v18.0',
        });

        whenFacebookIsAvailable();
    };
    (function (id) {
        const script = document.getElementById(id);
        if (script) script.remove();
    })('facebook-jssdk');
    
    (function (id) {
        if (document.getElementById(id)) return;

        const js = document.createElement('script');
        js.setAttribute('id', id);
        js.setAttribute('src', 'https://connect.facebook.net/en_US/sdk.js');
        js.async = true;
        js.defer = true;

        js.onload = function () {
            console.log("Facebook SDK loaded successfully.");
        };

        js.onerror = function () {
            console.error("Failed to load Facebook SDK.");
        };

        document.head.appendChild(js);
    })('facebook-jssdk');
}

export function startFacebook() {
    const appId = getEnv('VITE_APP_FACEBOOK_APP_ID') || '';
    const configId = getEnv('VITE_APP_WHATSAPP_FACEBOOK_APP_CONFIG_ID') || '';

    if (!appId) {
        console.error("Facebook App ID is missing.");
        return;
    }

    if (!configId) {
        console.error("Facebook Config ID is missing.");
        return;
    }

    initFacebookSDK({
        appId,
        whenFacebookIsAvailable() {
            console.log('Facebook SDK is active:', appId, '-', configId);

            FB.login(
                (response: { authResponse?: { code: string } }) => {
                    if (response && response.authResponse) {
                        const code = response.authResponse.code;
                        console.log('Authorization Code:', code);
                    } else {
                        console.error("User canceled login or did not fully authorize.");
                    }
                },
                {
                    auth_type: 'rerequest',
                    config_id: configId,
                    response_type: 'code',
                    override_default_response_type: true,
                    extras: {
                        setup: {},
                        featureType: '',
                        sessionInfoVersion: '3',
                    },
                }
            );
        },
    });
}
