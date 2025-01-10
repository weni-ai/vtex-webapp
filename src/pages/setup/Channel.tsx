import { Button, Flex, IconCheckCircle, Text } from "@vtex/shoreline";
import iconWhatsapp from '../../assets/channels/whatsapp.svg';
import { startFacebookLogin } from "../../utils/facebook/login";
import { useSelector } from "react-redux";
import { selectProject } from "../../store/projectSlice";
import { selectToken } from "../../store/authSlice";

export function Channel({ isIntegrated }: Readonly<{ isIntegrated: boolean }>) {
  const project_uuid = useSelector(selectProject)
  const token = useSelector(selectToken)
  const callFacebookSDK = () => {
    startFacebookLogin(project_uuid, token)
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
          <Text variant="display3" color="$fg-muted">{t('integration.channels.whatsapp.title')}</Text>

          <Text variant="caption1" color="$fg-base-soft">
          {t('integration.channels.whatsapp.description')}
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

{t('integration.buttons.integrated')}
            </Text>
          </Flex>
          :
          <Button variant="primary" onClick={callFacebookSDK}>{t('integration.buttons.integrate')}</Button>
      }
    </Flex>
  )
}