/* eslint-disable no-var */
/// <reference types="vite/client" />

declare global {
  declare var FB: {
    init: (config: {
      appId: string;
      xfbml: boolean;
      version: string;
    }) => void;

    login: (
      callback: (response: {
        authResponse?: {
          code: string;
        };
      }) => void,
      options?: {
        config_id: string;
        response_type: string;
        override_default_response_type: boolean;
        extras: {
          featureType: string;
          sessionInfoVersion: number;
          features: Array<{ name: string }>;
          setup: {
            preVerifiedPhone?: {
              ids: string[];
            };
          };
          version: string;
        };
      }
    ) => void;
  }

  var fbAsyncInit;

}

export {};
