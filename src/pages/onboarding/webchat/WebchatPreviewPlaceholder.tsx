import { useTranslation } from 'react-i18next';
import { Center, Flex, Text } from '@vtex/shoreline';
import { WebchatOnboardingLayoutType } from './WebchatOnboardingLayout';

interface WebchatPreviewPlaceholderProps {
  type: WebchatOnboardingLayoutType
  selectedUseCase: string | null;
}

/**
 * Placeholder for the future webchat live preview.
 * The `selectedUseCase` prop is accepted to prepare for a future integration
 * where the webchat preview flow changes based on the selected use case.
 */
export function WebchatPreviewPlaceholder(props: WebchatPreviewPlaceholderProps) {
  const { type, selectedUseCase: _selectedUseCase } = props;
  const { t } = useTranslation();

  return (
    <Flex direction="column" style={{ flex: 1, minWidth: 0, background: 'var(--sl-bg-informational)', borderRadius: 'var(--sl-radius-2)', overflow: 'hidden' }}>
      { type === 'preview' && (
        <Center style={{ height: 'unset', padding: 'var(--sl-space-3)', background: 'var(--sl-bg-base)', border: '1px solid var(--sl-color-blue-3)', borderRadius: 'var(--sl-radius-2) var(--sl-radius-2) 0 0' }}>
          <Text variant="caption2">
            {t('onboarding.onboard_setup.preview.banner')}
          </Text>
        </Center>
      )}

      <Center style={{ flex: 1 }}>
        Preview placeholder
        {/* Future: Webchat live preview component will be rendered here */}
      </Center>
    </Flex>
  );
}
