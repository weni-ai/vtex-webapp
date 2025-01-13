import { setAuthToken } from "src/utils/VTEXFetch";
import getEnv from "../utils/env";

export async function getToken() {
    const auth_url = getEnv('VITE_APP_AUTH_URL') || '';
    const client_id = getEnv('VITE_APP_CLIENT_ID') || '';
    const client_secret = getEnv('VITE_APP_CLIENT_SECRET') || '';

    const headersList = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    const bodyContent = `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`;

    if (auth_url) {
        const response = await fetch(auth_url, {
            method: "POST",
            body: bodyContent,
            headers: headersList
        });

        const data = await response.json();
        console.log('setando o token no io...', data.access_token)
        setAuthToken(data.access_token)
        return data.access_token
    }
}

