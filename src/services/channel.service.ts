/* eslint-disable react-hooks/rules-of-hooks */
import { useDispatch } from "react-redux";
import { VTEXFetch } from "../utils/VTEXFetch";
import { setLoadingWhatsAppIntegration, setWhatsAppError, setWhatsAppIntegrated } from "../store/userSlice";

export async function createChannel(code: string, project_uuid: string, wabaId: string, phoneId: string, token: string) {
  const dispatch = useDispatch()
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
        dispatch(setWhatsAppIntegrated(true))
        dispatch(setLoadingWhatsAppIntegration(true))
      }).catch((error) => {
        dispatch(setWhatsAppError(error))
        console.error('Error:', error);
      });
}