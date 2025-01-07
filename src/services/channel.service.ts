import { VTEXFetch } from "../utils/VTEXFetch";

export async function createChannel(code: string, project_uuid: string, wabaId: string, phoneId: string, token: string) {
    const data = {
        waba_id: wabaId,
        phone_number_id: phoneId,
        project_uuid: project_uuid,
        auth_code: code,
    };

    console.log("Creating channel with data:", data);

    await VTEXFetch(`/_v/whatsapp-integration?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((response) => {
        console.log('Whatsapp registered', response)
      }).catch((error) => {
        console.error('Error:', error);
      });
}