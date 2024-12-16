interface FacebookInitParams {
    appId: string;
    xfbml: boolean;
    version: string;
}

declare global {
    interface Window {
        fbAsyncInit?: () => void;
    }

    interface FBProps {
        init(params: FacebookInitParams): void;
    }

    let Facebook: FBProps;
}

export function initFacebookSdk(appId: string, loginCallback: () => void): void {
    window.fbAsyncInit = function () {
        Facebook.init({
            appId,
            xfbml: true,
            version: 'v18.0',
        });

        loginCallback();
    };

    (function (d: Document, s: string, id: string): void {
        const es = d.getElementById(id);
        if (es) es.remove();
        if (typeof Facebook !== 'undefined') {
            (window as any).Facebook = null;
        }
    })(document, 'script', 'facebook-jssdk');

    (function (d: Document, s: string, id: string): void {
        const js: HTMLScriptElement | null = d.createElement(s) as HTMLScriptElement;
        const fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk.js';
        fjs.parentNode?.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
}
