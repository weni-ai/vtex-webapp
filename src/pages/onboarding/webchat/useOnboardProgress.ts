import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectOnboardingStatus, setOnboardingStatus } from '../../../store/onboardSlice';
import { selectUser } from '../../../store/userSlice';
import { getOnboardingStatus } from '../../../services/onboarding.service';
import { getProgressStepInfo, isProgressComplete, ProgressStepInfo } from './progressSteps';
import { useAnimatedProgress } from './useAnimatedProgress';

const POLLING_INTERVAL_MS = 3_000;

export interface OnboardProgressResult {
  currentStep: string;
  progress: number;
  isComplete: boolean;
  stepInfo: ProgressStepInfo;
}

export function useOnboardProgress(): OnboardProgressResult {
  const dispatch = useDispatch();
  const onboardingStatus = useSelector(selectOnboardingStatus);
  const userData = useSelector(selectUser);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const currentStep = onboardingStatus?.current_step ?? '';
  const progress = onboardingStatus?.progress ?? 0;
  const backendComplete = isProgressComplete(currentStep, progress);

  const { step: animatedStep, progress: animatedProgress } = useAnimatedProgress(currentStep, progress);
  const displayComplete = isProgressComplete(animatedStep, animatedProgress);

  const pollStatus = useCallback(async () => {
    const vtexAccount = userData?.account;
    if (!vtexAccount || isPolling) return;
    try {
      setIsPolling(true);
      const response = await getOnboardingStatus(vtexAccount);
      if (response.success && response.data) {
        dispatch(setOnboardingStatus(response.data));
      }
    } finally {
      setIsPolling(false);
    }
  }, [dispatch, userData?.account, isPolling]);

  useEffect(() => {
    if (backendComplete) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(pollStatus, POLLING_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [pollStatus, backendComplete]);

  const stepInfo = useMemo(
    () => getProgressStepInfo(animatedStep, animatedProgress),
    [animatedStep, animatedProgress],
  );

  return { currentStep: animatedStep, progress: animatedProgress, isComplete: displayComplete, stepInfo };
}
