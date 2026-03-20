import { useTranslation } from 'react-i18next';
import { Flex, Text } from '@vtex/shoreline';
import previewEn from '../../../assets/onboarding/whatsapp_preview/en.svg';
import previewEs from '../../../assets/onboarding/whatsapp_preview/es.svg';
import previewPt from '../../../assets/onboarding/whatsapp_preview/pt.svg';

const PREVIEW_BY_LANGUAGE: Record<string, string> = {
  en: previewEn,
  es: previewEs,
  pt: previewPt,
};

export function WhatsAppPreview() {
  const { i18n, t } = useTranslation();

  const previewSrc = PREVIEW_BY_LANGUAGE[i18n.language] ?? previewEn;

  return (
    <Flex
      direction="column"
      style={{
        flex: 1,
        minHeight: 0,
        borderRadius: 'var(--sl-radius-2)',
        overflow: 'hidden',
      }}
      gap="$space-0"
    >
      <Flex
        align="center"
        justify="center"
        style={{
          flexShrink: 0,
          padding: 'var(--sl-space-3)',
          background: 'var(--sl-bg-base)',
          border: '1px solid var(--sl-color-blue-3)',
          borderTopLeftRadius: 'var(--sl-radius-2)',
          borderTopRightRadius: 'var(--sl-radius-2)',
        }}
      >
        <Text variant="caption2" style={{ textAlign: 'center' }}>
          {t('onboarding.onboard_setup.preview.banner')}
        </Text>
      </Flex>

      <Flex
        justify="center"
        style={{
          flex: 1,
          minHeight: 0,
          background: 'var(--sl-bg-informational)',
          borderBottomLeftRadius: 'var(--sl-radius-2)',
          borderBottomRightRadius: 'var(--sl-radius-2)',
        }}
      >
        <img
          src={previewSrc}
          alt="WhatsApp abandoned cart recovery preview"
          style={{
            height: '80%',
            maxWidth: '100%',
            objectFit: 'contain',
            borderRadius: '40px',
            marginTop: 'auto',
            boxShadow: 'var(--sl-shadow-2)',
          }}
        />
      </Flex>
    </Flex>
  );
}
