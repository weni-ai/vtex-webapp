import { useTranslation } from 'react-i18next';
import { Center, Flex, Text } from '@vtex/shoreline';
import { WebchatOnboardingLayoutType } from './WebchatOnboardingLayout';
import { useEffect, useRef, useState } from 'react';
import { mountWebchat, start } from './previewUseCases';
import { useCaseCatalogConciergeSteps } from './useCaseCatalogConcierge';
import { useCaseCancellationsSteps } from './useCaseCancellations';
import { useCaseOrderStatusSteps } from './useCaseOrderStatus';
import { useCaseFAQAssistantSteps } from './useCaseFAQAssistant';
import { VTEXOnboardAdapter } from '../../../api/onboarding/adapters';

const onboardingAdapter = new VTEXOnboardAdapter();
interface WebchatPreviewPlaceholderProps {
  type: WebchatOnboardingLayoutType;
  selectedUseCase: string | null;
  webchatAppUuid?: string | null;
}

/**
 * Placeholder for the future webchat live preview.
 * The `selectedUseCase` prop is accepted to prepare for a future integration
 * where the webchat preview flow changes based on the selected use case.
 */
export function WebchatPreviewPlaceholder(props: WebchatPreviewPlaceholderProps) {
  const { type, selectedUseCase, webchatAppUuid } = props;
  const { t } = useTranslation();

  const [isAlreadyLive, setIsAlreadyLive] = useState(false);

  useEffect(() => {
    if (type === 'preview') {
      mountWebchat({
        selector: '#wwc',
        mode: 'preview',
        title: t('onboarding.onboard_setup.preview.webchat.title'),
        subtitle: t('onboarding.onboard_setup.preview.webchat.subtitle'),
      });
    } else if (type === 'test' && webchatAppUuid) {
      onboardingAdapter.getWebchatConfig(webchatAppUuid).then((result) => {
        const flowObjectUuid = result.success && result.data?.flow_object_uuid;
        
        if (flowObjectUuid) {
          mountWebchat({
            ...result.data?.config,
            selector: '#wwc',
            mode: 'live',
            channelUuid: flowObjectUuid,
          });

          setIsAlreadyLive(true);
        }
      });
    }
  }, [type, webchatAppUuid]);

  const stopPreviewRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (type === 'preview') {
      if (selectedUseCase === 'catalog_concierge') {
        const { stop } = start(useCaseCatalogConciergeSteps());
        stopPreviewRef.current = stop;
      } else if (selectedUseCase === 'cancellations') {
        const { stop } = start(useCaseCancellationsSteps());
        stopPreviewRef.current = stop;
      } else if (selectedUseCase === 'order_status') {
        const { stop } = start(useCaseOrderStatusSteps());
        stopPreviewRef.current = stop;
      } else if (selectedUseCase === 'faq_assistant') {
        const { stop } = start(useCaseFAQAssistantSteps());
        stopPreviewRef.current = stop;
      } else {
        stopPreviewRef.current = null;
      }
    } else if (type === 'test' && isAlreadyLive) {
      WebChat.send(t(`onboarding.onboard_setup.use_cases.${selectedUseCase}.example_start_message`));
    }

    return () => {
      stopPreviewRef.current?.();
      stopPreviewRef.current = null;
    };
  }, [type, selectedUseCase]);

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
        <section id="wwc"></section>
      </Center>
    </Flex>
  );
}
