/* eslint-disable react-hooks/rules-of-hooks */
import { useDispatch, useSelector } from "react-redux";
import { VTEXFetch } from "../utils/VTEXFetch";
import { setLoadingWhatsAppIntegration, setWhatsAppError, setWhatsAppIntegrated } from "../store/userSlice";
import { toast } from "@vtex/shoreline";
import { selectBaseAddress } from "../store/authSlice";

export async function createChannel(code: string, project_uuid: string, wabaId: string, phoneId: string, token: string) {
  console.log('entrou no create channel...')
  const dispatch = useDispatch();
  console.log('setou o dispatch...')
  const base_address = useSelector(selectBaseAddress)
  console.log('base address', base_address)
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
  }).then(async (response) => {
    console.log('Whatsapp registered', response)
    dispatch(setWhatsAppIntegrated(true))
    dispatch(setLoadingWhatsAppIntegration(true))
    const integrateData = {
      project_uuid: project_uuid,
      store: base_address,
      flows_channel_uuid: response.flow_object_uuid,
      wpp_cloud_app_uuid: response.data.app_uuid
    }
    await VTEXFetch(`/_v/integrate-available-features?token=${token}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(integrateData),
    })
  }).catch((error) => {
    dispatch(setWhatsAppError(error))
    console.error('Error:', error);
    toast.critical(t('integrations.channel.whatsapp.error'));
  });
}