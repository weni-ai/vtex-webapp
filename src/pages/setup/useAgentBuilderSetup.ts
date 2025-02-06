/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from 'react-router-dom';
import { setAgentBuilder } from '../../services/agent.service';
import { useSelector } from 'react-redux';
import { selectToken } from '../../store/authSlice';
import { toast } from '@vtex/shoreline';
import store from '../../store/provider.store';
import { selectProject, setAgentLoading } from '../../store/projectSlice';
import { integrateFeature } from '../../services/features.service';

export function useAgentBuilderSetup() {
    const navigate = useNavigate();
    const token = useSelector(selectToken);
    const project = useSelector(selectProject)
    store.dispatch(setAgentLoading(true))

    const buildAgent = async (payload: any, app_uuid: string) => {
        
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

        const response = await setAgentBuilder(body, app_uuid, token);
        console.log('aquiiii')
        //quebrando aqui
        if (response?.error) {
            console.log('deu erro aqui')
            toast.critical(t('agent.error'));
        } else {
            console.log('funfou')
            toast.success(t('agent.success'))
            const orderStatus = store.getState().project.featureList.find(item => item.code === 'order-status')?.feature_uuid
            console.log('order status uuid: ', orderStatus)
            if (orderStatus) {
                const integrateResponse = await integrateFeature(orderStatus, project, token)
                if(integrateResponse?.error){
                    toast.critical(t('integration.error'));
                }
            }
            console.log('setando o loading pra false')
            store.dispatch(setAgentLoading(false))
            navigate('/dash');
        }
    };

    return { buildAgent };
}
