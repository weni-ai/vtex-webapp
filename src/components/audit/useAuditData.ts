import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectOnboardingStatus } from '../../store/onboardSlice';
import { fetchSupervisorConversations } from '../../api/supervisor/requests';
import { isProgressComplete } from '../../pages/onboarding/webchat/progressSteps';
import type { SupervisorConversation } from '../../interfaces/Supervisor';

export type AuditDataState =
  | 'loading'
  | 'onboarding_skipped'
  | 'empty'
  | 'data';

export interface UseAuditDataResult {
  state: AuditDataState;
  conversations: SupervisorConversation[];
  isActivationEnabled: boolean;
}

export function useAuditData(): UseAuditDataResult {
  const onboardingStatus = useSelector(selectOnboardingStatus);
  const [conversations, setConversations] = useState<SupervisorConversation[]>([]);

  const isSkipped = onboardingStatus?.skipped === true && !onboardingStatus?.completed;
  const hasFetched = useRef(false);
  const [isLoading, setIsLoading] = useState(!isSkipped);

  const isActivationEnabled = isProgressComplete(
    onboardingStatus?.current_step,
    onboardingStatus?.progress ?? 0,
  );

  const fetchConversations = useCallback(async () => {
    if (isSkipped) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await fetchSupervisorConversations();
      setConversations(data);
    } catch {
      setConversations([]);
    } finally {
      setIsLoading(false);
      hasFetched.current = true;
    }
  }, [isSkipped]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const state: AuditDataState = (() => {
    if (isLoading) return 'loading';
    if (isSkipped) return 'onboarding_skipped';
    if (conversations.length === 0) return 'empty';
    return 'data';
  })();

  return { state, conversations, isActivationEnabled };
}
