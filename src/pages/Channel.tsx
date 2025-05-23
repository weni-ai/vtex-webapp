import { Button, Flex, IconCheck, Spinner, Text } from "@vtex/shoreline";
import iconWhatsapp from '../assets/channels/whatsapp.svg';
import { startFacebookLogin } from "../utils/facebook/login";
import { useSelector } from "react-redux";
import { selectProject, wppLoading } from "../store/projectSlice";

export function Channel({ isIntegrated, showSkipDisclaimer }: Readonly<{ isIntegrated: boolean, showSkipDisclaimer: boolean }>) {
  const project_uuid = useSelector(selectProject)
  const isWppLoading = useSelector(wppLoading)
  const callFacebookSDK = () => {
    startFacebookLogin(project_uuid)
  }
  return (
    <Flex
      gap="$space-4"
      style={{
        border: 'var(--sl-border-base)',
        borderRadius: 'var(--sl-radius-1)',
        padding: 'var(--sl-space-4)',
      }}
    >
      <Flex
        gap={'16px'}
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
        <Flex direction="column" gap="$space-4">
          <Flex
            direction="column"
            gap="$space-1"
          >
            <Text variant="display3" color="$fg-muted">{t('integration.channels.whatsapp.title')}</Text>

            <Text variant="body" color="$fg-base-soft">
              {t('integration.channels.whatsapp.description')}
            </Text>
          </Flex>

          {showSkipDisclaimer && (
            <Text variant="body" color="$fg-base-disabled">
              {t('integration.channels.whatsapp.skip_disclaimer')}
            </Text>
          )}
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
            <Text variant="body" color="$fg-success" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2, 8px)', fontWeight: 'bold'}}>
              <Flex style={{width: ' 20px', height: '20px'}}>
                <IconCheck />
              </Flex>

              {t('integration.buttons.integrated')}
            </Text>
          </Flex>
          :
          <Button variant="primary" onClick={callFacebookSDK}> {isWppLoading ? <Spinner description="loading" /> : <span>{t('integration.buttons.integrate')}</span>}</Button>
      }
    </Flex>
  )
}