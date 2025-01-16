/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from 'react-router-dom';
import { setAgentBuilder } from '../../services/agent.service';
import { useSelector } from 'react-redux';
import { selectToken } from '../../store/authSlice';
import { toast } from '@vtex/shoreline';
import store from '../../store/provider.store';
import { setAgentLoading } from '../../store/projectSlice';

export function useAgentBuilderSetup() {
    const navigate = useNavigate();
    const token = useSelector(selectToken);

    const buildAgent = async (payload: any, app_uuid: string) => {
        store.dispatch(setAgentLoading(true))
        const cleanedPayload = Object.fromEntries(
            Object.entries(payload).filter(([_, value]) => value !== null && value !== undefined && value !== '')
        );

        const { name, occupation, objective, knowledge } = cleanedPayload;
        const links = knowledge ? [`https://${knowledge}`] : [];

        try {
            const body = {
                agent: {
                    name,
                    objective,
                    occupation,
                },
                links,
            };

            await setAgentBuilder(body, app_uuid, token);

            toast.success(t('agent.success'))
            navigate('/dash');
        } catch (error) {
            toast.critical(t('agent.error'))
        }
        store.dispatch(setAgentLoading(false))
    };

    return { buildAgent };
}
