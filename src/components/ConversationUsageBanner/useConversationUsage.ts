import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectProject } from '../../store/projectSlice';
import { getConversationsCount } from '../../api/conversations/requests';

interface ConversationUsageState {
  conversationsCount: number | null;
  isLoading: boolean;
  error: Error | null;
}

export function useConversationUsage() {
  const projectUuid = useSelector(selectProject);

  const [state, setState] = useState<ConversationUsageState>({
    conversationsCount: null,
    isLoading: true,
    error: null,
  });

  const fetchConversationsCount = useCallback(async () => {
    try {
      const count = await getConversationsCount();
      setState({
        conversationsCount: count,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState({
        conversationsCount: null,
        isLoading: false,
        error: err instanceof Error ? err : new Error('Failed to fetch conversations count'),
      });
    }
  }, []);

  useEffect(() => {
    if (!projectUuid) return;

    fetchConversationsCount();
  }, [projectUuid, fetchConversationsCount]);

  return state;
}
