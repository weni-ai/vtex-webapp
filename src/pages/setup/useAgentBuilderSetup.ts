/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from 'react-router-dom';
import { setAgentBuilder } from '../../services/agent.service';

export function useAgentBuilderSetup() {
    const navigate = useNavigate();
    const buildAgent = async (payload: any, app_uuid: string) => {
        console.log('entrou no agent com:', payload, app_uuid)
        try {
            const data = await setAgentBuilder(payload, app_uuid);
            console.log('data', data)
            navigate('/channels')
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return { buildAgent };
}
