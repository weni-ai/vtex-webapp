import { toast } from '@vtex/shoreline';
import { useNavigate } from 'react-router-dom';
import { setAgentBuilder } from '../../services/agent.service';
import { setAgentBuilderLoading } from '../../store/projectSlice';
import store from '../../store/provider.store';

export function useAgentBuilderSetup() {
  const navigate = useNavigate();

  const buildAgent = async (payload: {
    name: string;
    knowledge: string;
    occupation: string;
    objective: string;
  }, redirect: boolean = true, successMessage: string = t('agent.success')) => {
    store.dispatch(setAgentBuilderLoading(true))
    const cleanedPayload = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== null && value !== undefined && value !== '')
    );

    const { name, occupation, objective, knowledge } = cleanedPayload;
    const links = knowledge ? [`https://${knowledge}`] : [];


    const body = {
      agent: {
        name,
        objective,
        occupation,
      },
      links,
    };

    const response = await setAgentBuilder(body);

    if (response?.error) {
      toast.critical(t('agent.error'));
    } else {
      if (successMessage) {
        toast.success(successMessage)
      }

      store.dispatch(setAgentBuilderLoading(false));

      if (redirect) {
        navigate('/dash');
      }
    }
    store.dispatch(setAgentBuilderLoading(false))
  };

  return { buildAgent };
}
