import getEnv from "../env";

function initFacebookSDK({ appId, whenFacebookIsAvailable }: { appId: string, whenFacebookIsAvailable: () => void }) {
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

        if (typeof FB !== 'undefined') {
            FB = null;
        }
    })('facebook-jssdk');

    (function (id) {
        if (document.getElementById(id)) return;

        const js = document.createElement('script');
        js.setAttribute('id', id);
        js.setAttribute('src', 'https://connect.facebook.net/en_US/sdk.js');

        document.head.appendChild(js);
    })('facebook-jssdk');
}

export function startFacebook() {
    console.log('óia os env:',process.env)
    const appId = getEnv('VITE_APP_FACEBOOK_APP_ID') || ''
    const configId = getEnv('VITE_APP_WHATSAPP_FACEBOOK_APP_CONFIG_ID') || ''
    initFacebookSDK({
        appId,
        whenFacebookIsAvailable() {
            console.log('is active', appId, ' - ', configId)

            FB.login(
                (response: { authResponse: { code: string } }) => {
                    console.log('test', response);
                    if (response.authResponse) {
                        const code = response.authResponse.code;
                        console.log('code', code)
                    }
                },
                {
                    config_id: configId,
                    response_type: 'code',
                    override_default_response_type: true,
                    extras: {
                        setup: {},
                        featureType: '',
                        sessionInfoVersion: '3',
                    },
                },
            );
        },
    })
}