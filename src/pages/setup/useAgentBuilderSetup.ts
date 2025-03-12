/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from 'react-router-dom';
import { setAgentBuilder } from '../../services/agent.service';
import { useSelector } from 'react-redux';
import { toast } from '@vtex/shoreline';
import store from '../../store/provider.store';
import { selectProject, setAgentBuilderLoading } from '../../store/projectSlice';
import { integrateAgent } from '../../services/agent.service';

export function useAgentBuilderSetup() {
    const navigate = useNavigate();
    const project = useSelector(selectProject) || ''
    
    const buildAgent = async (payload: any, app_uuid: string) => {
        store.dispatch(setAgentBuilderLoading(true))
        const cleanedPayload = Object.fromEntries(
            Object.entries(payload).filter(([_, value]) => value !== null && value !== undefined && value !== '')
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

        const response = await setAgentBuilder(body, app_uuid);

        if (response?.error) {
            toast.critical(t('agent.error'));
        } else {
            toast.success(t('agent.success'))
            const orderStatus = store.getState().project.agents.find(item => item.code === 'order_status')?.uuid
            if (orderStatus) {
                const integrateResponse = await integrateAgent(orderStatus, project)
                if(integrateResponse?.error){
                    toast.critical(t('integration.error'));
                }
            }

            store.dispatch(setAgentBuilderLoading(false))
            navigate('/dash');
        }
    };

    return { buildAgent };
}
