export  interface FB {
    init(config: FBInitConfig): void;
    login(
        callback: (response: FBLoginResponse) => void,
        options?: FBLoginOptions
    ): void;
}

export interface FBInitConfig {
    appId: string;
    xfbml: boolean;
    version: string;
}

export interface FBLoginResponse {
    authResponse?: {
        code: string;
    };
}

/** Extras for WhatsApp Embedded Signup v3 */
export interface FBLoginExtrasV3 {
    featureType: string;
    sessionInfoVersion: number;
    features: Array<{ name: string }>;
    setup: {
        preVerifiedPhone?: {
            ids: string[];
        };
    };
    version: string;
}

export interface FBLoginOptions {
    config_id: string;
    response_type: string;
    override_default_response_type: boolean;
    extras: FBLoginExtrasV3;
}