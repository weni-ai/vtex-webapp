import { useTranslation } from 'react-i18next';
import {
  Flex,
  Heading,
  IconCheckCircleFill,
  Text,
} from '@vtex/shoreline';

interface CompletionBannerProps {
  completionItems: string[];
}

export function CompletionBanner({ completionItems }: CompletionBannerProps) {
  const { t } = useTranslation();

  return (
    <Flex direction="column" gap="$space-3">
      <Flex gap="$space-2" align="center">
        <IconCheckCircleFill style={{ color: 'var(--sl-color-green-8)', fontSize: 20 }} />
        <Heading variant="display3">
          {t('onboarding.onboard_test.completion.heading')}
        </Heading>
      </Flex>

      <Flex gap="$space-4">
        {completionItems.map((item) => (
          <Text key={item} variant="body">
            {`✓ ${item}`}
          </Text>
        ))}
      </Flex>
    </Flex>
  );
}
