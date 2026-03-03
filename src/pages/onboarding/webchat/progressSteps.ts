import { ONBOARDING_STEPS } from "../../../constants/onboarding";
export type OnboardStep = typeof ONBOARDING_STEPS[keyof typeof ONBOARDING_STEPS];

interface SubStep {
  maxProgress: number;
  descriptionKey: string;
}

interface StageConfig {
  stageNumber: number;
  labelKey: string;
  overallOffset: number;
  overallRange: number;
  stageEnd: number;
  subSteps: SubStep[];
}

export interface ProgressStepInfo {
  stageLabel: string;
  stageNumber: number;
  stageEnd: number;
  overallProgress: number;
  descriptionKey: string;
  segmentFills: [number, number, number];
  isComplete: boolean;
}

const STEP_ORDER: OnboardStep[] = [ONBOARDING_STEPS.PROJECT_CONFIG, ONBOARDING_STEPS.CRAWL, ONBOARDING_STEPS.NEXUS_CONFIG];

const STAGE_CONFIG: Record<OnboardStep, StageConfig> = {
  [ONBOARDING_STEPS.PROJECT_CONFIG]: {
    stageNumber: 1,
    labelKey: 'onboarding.onboard_setup.progress.stages.environment_sync',
    overallOffset: 0,
    overallRange: 0.30,
    stageEnd: 30,
    subSteps: [
      { maxProgress: 45, descriptionKey: 'onboarding.onboard_setup.progress.descriptions.syncing_credentials' },
      { maxProgress: 90, descriptionKey: 'onboarding.onboard_setup.progress.descriptions.configuring_workspace' },
      { maxProgress: 100, descriptionKey: 'onboarding.onboard_setup.progress.descriptions.mapping_data_structure' },
    ],
  },
  [ONBOARDING_STEPS.CRAWL]: {
    stageNumber: 2,
    labelKey: 'onboarding.onboard_setup.progress.stages.knowledge_building',
    overallOffset: 30,
    overallRange: 0.40,
    stageEnd: 70,
    subSteps: [
      { maxProgress: 40, descriptionKey: 'onboarding.onboard_setup.progress.descriptions.analyzing_catalog' },
      { maxProgress: 70, descriptionKey: 'onboarding.onboard_setup.progress.descriptions.extracting_knowledge' },
      { maxProgress: 100, descriptionKey: 'onboarding.onboard_setup.progress.descriptions.refining_data' },
    ],
  },
  [ONBOARDING_STEPS.NEXUS_CONFIG]: {
    stageNumber: 3,
    labelKey: 'onboarding.onboard_setup.progress.stages.agent_training',
    overallOffset: 70,
    overallRange: 0.30,
    stageEnd: 100,
    subSteps: [
      { maxProgress: 40, descriptionKey: 'onboarding.onboard_setup.progress.descriptions.assembling_agents' },
      { maxProgress: 70, descriptionKey: 'onboarding.onboard_setup.progress.descriptions.defining_instructions' },
      { maxProgress: 100, descriptionKey: 'onboarding.onboard_setup.progress.descriptions.installing_webchat' },
    ],
  },
};

function isValidStep(step: string): step is OnboardStep {
  return STEP_ORDER.includes(step as OnboardStep);
}

function getStepIndex(step: OnboardStep): number {
  return STEP_ORDER.indexOf(step);
}

function getSubStepDescriptionKey(config: StageConfig, progress: number): string {
  for (const subStep of config.subSteps) {
    if (progress <= subStep.maxProgress) {
      return subStep.descriptionKey;
    }
  }
  return config.subSteps[config.subSteps.length - 1].descriptionKey;
}

function computeSegmentFills(currentStep: OnboardStep, progress: number): [number, number, number] {
  const currentIndex = getStepIndex(currentStep);

  return STEP_ORDER.map((_step, index) => {
    if (index < currentIndex) return 100;
    if (index === currentIndex) return Math.min(Math.max(progress, 0), 100);
    return 0;
  }) as [number, number, number];
}

export function isProgressComplete(currentStep: string | undefined, progress: number): boolean {
  return currentStep === ONBOARDING_STEPS.NEXUS_CONFIG && progress >= 100;
}

export function getProgressStepInfo(currentStep: string | undefined, progress: number): ProgressStepInfo {
  const safeStep: OnboardStep = (currentStep && isValidStep(currentStep)) ? currentStep : ONBOARDING_STEPS.PROJECT_CONFIG;
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  const config = STAGE_CONFIG[safeStep];

  const isComplete = isProgressComplete(currentStep, progress);
  const overallProgress = Math.round(config.overallOffset + safeProgress * config.overallRange);
  const descriptionKey = isComplete
    ? 'onboarding.onboard_setup.progress.descriptions.setup_completed'
    : getSubStepDescriptionKey(config, safeProgress);
  const segmentFills = computeSegmentFills(safeStep, safeProgress);

  return {
    stageLabel: config.labelKey,
    stageNumber: config.stageNumber,
    stageEnd: config.stageEnd,
    overallProgress,
    descriptionKey,
    segmentFills,
    isComplete,
  };
}
