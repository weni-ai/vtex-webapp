import { Button, Flex, IconCheckCircle, Text } from "@vtex/shoreline";
import iconWhatsapp from '../../assets/channels/whatsapp.svg';

export function initFacebookSDK({ appId, whenFacebookIsAvailable }: { appId: string, whenFacebookIsAvailable: () => void }) {
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

export function Channel({ isIntegrated }: { isIntegrated: boolean }) {
  function startFacebook() {
    initFacebookSDK({
      appId: '1643506673262170',

      whenFacebookIsAvailable() {
        console.log('is active')

        FB.login(
          (response: { authResponse: { code: string } }) => {
            console.log('test', response);
            if (response.authResponse) {
              const code = response.authResponse.code;
              console.log('code', code)
            } else {
            }
          },
          {
            config_id: '547030034965228',
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
  
  return (
    <Flex
      direction="column"
      gap="$space-4"
      style={{
        border: 'var(--sl-border-base)',
        borderRadius: 'var(--sl-radius-1)',
        padding: 'var(--sl-space-4)',
      }}
    >
      <Flex
        gap="$space-2"
        align="start"
        style={{
          marginBottom: 'var(--sl-space-2)'
        }}
      >
        <img
          src={iconWhatsapp}
          alt="manage search icon"
          style={{
            borderRadius: 'var(--sl-radius-1)',
          }}
        />

        <Flex
          direction="column"
          gap="$space-1"
        >
          <Text variant="display3" color="$fg-muted">WhatsApp Channel</Text>

          <Text variant="caption1" color="$fg-base-soft">
            If you have an enterprise WhatsApp account, you can connect it to communicate with your contacts.
          </Text>
        </Flex>
      </Flex>

      {
        isIntegrated ?
          <Flex
            justify="center"
            style={{
              padding: 'var(--sl-space-2)'
            }}
          >
            <Text variant="caption1" color="$fg-success">
              <IconCheckCircle
                display="inline"
                style={{
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  marginRight: 'var(--sl-space-2)'
                }}
              />

              Integrated channel
            </Text>
          </Flex>
          :
          <Button variant="primary" onClick={startFacebook}>Integrate</Button>
      }
    </Flex>
  )
}