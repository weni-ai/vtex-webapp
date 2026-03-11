import { useTranslation } from 'react-i18next';
import { Radio, RadioGroup, useRadioState } from '@vtex/shoreline';
import type { ActivationMode } from './activationConstants';

interface ActivationSectionProps {
  activationMode: ActivationMode;
  onModeChange: (mode: ActivationMode) => void;
  labelKey?: string;
  safeLabelKey?: string;
  fullLabelKey?: string;
  safeDescriptionKey?: string;
  fullDescriptionKey?: string;
}

export function ActivationSection(props: ActivationSectionProps) {
  const {
    activationMode,
    onModeChange,
    labelKey = 'onboarding.onboard_test.activation.title',
    safeLabelKey = 'onboarding.onboard_test.activation.safe_label',
    fullLabelKey = 'onboarding.onboard_test.activation.full_label',
    safeDescriptionKey = 'onboarding.onboard_test.activation.safe_description',
    fullDescriptionKey = 'onboarding.onboard_test.activation.full_description',
  } = props;

  const { t } = useTranslation();

  const radioState = useRadioState({
    defaultValue: activationMode,
    setValue: (value) => {
      if (value === 'safe' || value === 'full') {
        onModeChange(value);
      }
    },
  });

  const descriptionKey = activationMode === 'safe'
    ? safeDescriptionKey
    : fullDescriptionKey;

  return (
    <RadioGroup
      label={t(labelKey)}
      horizontal
      state={radioState}
      description={t(descriptionKey)}
    >
      <Radio value="safe">
        {t(safeLabelKey)}
      </Radio>
      <Radio value="full">
        {t(fullLabelKey)}
      </Radio>
    </RadioGroup>
  );
}
