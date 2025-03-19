/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
          sessionInfoVersion: number;
        };
      }
    ) => void;
  }

  var fbAsyncInit;

}

export {};
