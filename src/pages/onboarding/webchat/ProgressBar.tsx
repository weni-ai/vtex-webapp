import { useTranslation } from 'react-i18next';
import { Flex, Heading, IconCheckCircleFill, Text } from '@vtex/shoreline';
import { getProgressStepInfo } from './progressSteps';

interface ProgressBarProps {
  currentStep: string;
  progress: number;
  isFailed?: boolean;
}

export function ProgressBar(props: ProgressBarProps) {
  const { currentStep, progress, isFailed = false } = props;
  const { t } = useTranslation();
  const stepInfo = getProgressStepInfo(currentStep, progress);

  if (isFailed) {
    return (
      <Flex direction="column" gap="$space-2">
        <Flex direction="column" gap="$space-2">
          <Heading variant="display3">
            {t('onboarding.onboard_setup.progress.failed.title')}
          </Heading>
          <Text variant="body">
            {t('onboarding.onboard_setup.progress.failed.description')}
          </Text>
        </Flex>

        <Flex gap="$space-4" style={{ width: '100%' }}>
          {stepInfo.segmentFills.map((fill, index) => (
            <Flex key={index} style={{ flex: 1, height: 12, background: 'var(--sl-color-red-3)', borderRadius: 'var(--sl-radius-2)', overflow: 'hidden' }}>
              <Flex
                style={{ height: '100%', background: 'var(--sl-color-red-8)', borderRadius: 'var(--sl-radius-2)', width: `${fill}%` }}
              />
            </Flex>
          ))}
        </Flex>
      </Flex>
    );
  }

  const stageLabel = t(stepInfo.stageLabel);
  const description = t(stepInfo.descriptionKey);
  const stageTitle = `${t('onboarding.onboard_setup.progress.stage_prefix', { current: stepInfo.stageNumber, total: 3 })} - ${stageLabel}`;
  const stageProgress = `(${stepInfo.overallProgress}% - ${stepInfo.stageEnd}%)`;

  const trackColor = stepInfo.isComplete
    ? 'var(--sl-color-green-3)'
    : 'var(--sl-color-blue-3)';
  const fillColor = stepInfo.isComplete
    ? 'var(--sl-color-green-8)'
    : 'var(--sl-color-blue-8)';

  return (
    <Flex direction="column" gap="$space-2">
      <Flex direction="column" gap="$space-2">
        <Flex align="center" gap="$space-1">
          <Heading variant="display3">
            {stageTitle}
          </Heading>
          <Text variant="display4">{stageProgress}</Text>
          <span style={{ display: 'inline-flex', opacity: stepInfo.isComplete ? 1 : 0, transition: 'opacity 0.6s ease' }}>
            <IconCheckCircleFill
              width={20}
              height={20}
              style={{ color: 'var(--sl-color-green-8)' }}
            />
          </span>
        </Flex>
        <Text variant="body">{description}</Text>
      </Flex>

      <Flex gap="$space-4" style={{ width: '100%' }}>
        {stepInfo.segmentFills.map((fill, index) => (
          <Flex key={index} style={{ flex: 1, height: 12, background: trackColor, borderRadius: 'var(--sl-radius-2)', overflow: 'hidden', transition: 'background 0.6s ease' }}>
            <Flex
              style={{ height: '100%', background: fillColor, borderRadius: 'var(--sl-radius-2)', width: `${fill}%`, transition: 'background 0.6s ease, width 50ms linear' }}
            />
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}
