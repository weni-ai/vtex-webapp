import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Bleed,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  Page,
  PageContent,
  PageHeader,
  PageHeaderRow,
  PageHeading,
  Stack,
} from '@vtex/shoreline';
import { UseCaseCard } from './UseCaseCard';
import { WebchatPreviewPlaceholder } from './WebchatPreviewPlaceholder';
import { WEBCHAT_USE_CASES, UseCaseId } from './webchatUseCases';

interface PrimaryActionConfig {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

interface SkipActionConfig {
  onClick: () => void;
  disabled?: boolean;
}

export type WebchatOnboardingLayoutType = 'preview' | 'test';

interface WebchatOnboardingLayoutProps {
  title: string;
  primaryAction: PrimaryActionConfig;
  skipAction?: SkipActionConfig;
  topSection: React.ReactNode;
  useCasesTitle: string;
  useCaseDescriptions: Record<UseCaseId, string>;
  belowCards?: React.ReactNode;
  type: WebchatOnboardingLayoutType;
  webchatAppUuid?: string | null;
}

export function WebchatOnboardingLayout(props: WebchatOnboardingLayoutProps) {
  const {
    title,
    primaryAction,
    skipAction,
    topSection,
    useCasesTitle,
    useCaseDescriptions,
    belowCards,
    type,
    webchatAppUuid,
  } = props;

  const { t } = useTranslation();
  const [selectedUseCase, setSelectedUseCase] = useState<UseCaseId | null>(
    type === 'test' ? null : WEBCHAT_USE_CASES[0].id,
  );

  return (
    <Page style={{ height: '100vh', padding: 'var(--sl-space-6)' }}>
      <PageHeader style={{ padding: 'var(--sl-space-5)' }}>
        <PageHeaderRow>
          <PageHeading>{title}</PageHeading>
          <Stack space="$space-3" horizontal>
            {skipAction && (
              <Bleed top="$space-2" bottom="$space-2">
                <Button
                  variant="secondary"
                  size="large"
                  onClick={skipAction?.onClick}
                >
                  {t('common.skip')}
                </Button>
              </Bleed>
            )}
            <Bleed top="$space-2" bottom="$space-2">
              <Button
                variant="primary"
                size="large"
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled}
                loading={primaryAction.loading}
              >
                {primaryAction.label}
              </Button>
            </Bleed>
          </Stack>
        </PageHeaderRow>
      </PageHeader>

      <PageContent style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 'var(--sl-space-5) 0 0 0', margin: '0' }}>
        <Flex direction="column" gap="$space-5" grow={1}>
          {topSection}

          <Divider />

          <Flex direction="column" gap="$space-4" style={{ flex: 1, minHeight: 0 }}>
            <Heading variant="display3">{useCasesTitle}</Heading>

            <Flex gap="$space-4" style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <Flex direction="column" gap="$space-2" style={{ width: 420, flexShrink: 0 }}>
                <Grid autoRows="1fr" gap="$space-2">
                  {WEBCHAT_USE_CASES.map((useCase) => (
                    <UseCaseCard
                    key={useCase.id}
                    title={t(useCase.titleKey)}
                    icon={useCase.icon}
                    description={useCaseDescriptions[useCase.id]}
                    isSelected={selectedUseCase === useCase.id}
                    onClick={() => setSelectedUseCase(useCase.id)}
                    type={type}
                    />
                  ))} 
                </Grid>

                {belowCards}
              </Flex>

              <WebchatPreviewPlaceholder selectedUseCase={selectedUseCase} type={type} webchatAppUuid={webchatAppUuid} />
            </Flex>
          </Flex>
        </Flex>
      </PageContent>
    </Page>
  );
}
