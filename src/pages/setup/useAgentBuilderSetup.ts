/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from 'react-router-dom';
import { setAgentBuilder } from '../../services/agent.service';
import { useSelector } from 'react-redux';
import { selectToken } from '../../store/authSlice';

export function useAgentBuilderSetup() {
    const navigate = useNavigate();
    const token = useSelector(selectToken);

    const buildAgent = async (payload: any, app_uuid: string) => {
        console.log('entrou no agent com:', payload, app_uuid);
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
            navigate('/channels');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return { buildAgent };
}
