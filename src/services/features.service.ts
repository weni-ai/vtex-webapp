import { VTEXFetch } from "../utils/VTEXFetch";
import storeProvider from "../store/provider.store";

export async function getFeatureList(project_uuid: string, token: string) {
  try {
    const response = await VTEXFetch(`/_v/get-feature-list?projectUUID=${project_uuid}&token=${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response || response.error) {
      throw new Error(response?.message || 'Erro ao obter lista de funcionalidades.');
    }

    return { success: true, data: response };
  } catch (error) {
    console.error('Erro ao obter lista de funcionalidades:', error);
    return { success: false, error: error|| 'Erro desconhecido' };
  }
}

export async function integrateFeature(feature_uuid: string, project_uuid: string, token: string) {
  const store = storeProvider.getState().auth.base_address;
  const flows_channel_uuid = storeProvider.getState().project.flows_channel_uuid;
  const wpp_cloud_app_uuid = storeProvider.getState().project.wpp_cloud_app_uuid;

  const data = {
    feature_uuid,
    project_uuid,
    store,
    flows_channel_uuid,
    wpp_cloud_app_uuid,
  };
  

  try {
    const response = await VTEXFetch(`/_v/integrate-feature?${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response || response.error) {
      throw new Error(response?.message || 'Erro ao integrar funcionalidades.');
    }

    console.log('Funcionalidades integradas com sucesso:', response);

    return { success: true, data: response };
  } catch (error) {
    console.error('Erro ao integrar funcionalidades:', error);
    return { success: false, error: error|| 'Erro desconhecido' };
  }
}

export async function integrateAvailableFeatures(project_uuid: string, token: string) {
  const store = storeProvider.getState().auth.base_address;
  const flows_channel_uuid = storeProvider.getState().project.flows_channel_uuid;
  const wpp_cloud_app_uuid = storeProvider.getState().project.wpp_cloud_app_uuid;

  const data = {
    project_uuid,
    store,
    flows_channel_uuid,
    wpp_cloud_app_uuid,
  };

  try {
    const response = await VTEXFetch(`/_v/integrate-available-features?token=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response || response.error) {
      throw new Error(response?.message || 'Erro ao integrar funcionalidades.');
    }

    console.log('Funcionalidades integradas com sucesso:', response);

    return { success: true, data: response };
  } catch (error) {
    console.error('Erro ao integrar funcionalidades:', error);
    return { success: false, error: error|| 'Erro desconhecido' };
  }
}
