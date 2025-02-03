/* eslint-disable @typescript-eslint/no-explicit-any */
import getEnv from "../utils/env";

export async function getToken() : Promise<any> {
    const auth_url = getEnv('VITE_APP_AUTH_URL') || '';
    const client_id = getEnv('VITE_APP_CLIENT_ID') || '';
    const client_secret = getEnv('VITE_APP_CLIENT_SECRET') || '';

    if (!auth_url || !client_id || !client_secret) {
        console.error('Erro: Configurações de autenticação ausentes.');
        return { success: false, error: 'Configuração de autenticação ausente.' };
    }

    const headersList = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/x-www-form-urlencoded"
    };

    const bodyContent = `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`;

    try {
        const response = await fetch(auth_url, {
            method: "POST",
            body: bodyContent,
            headers: headersList
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.error_description || `Erro ${response.status}` };
        }

        return { success: true, token: data.access_token };
    } catch (error) {
        console.error('Erro ao obter token:', error);
        return { success: false, error: error || 'Erro desconhecido' };
    }
}
