
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Agent, Feature, Loading, ProjectState, RootState } from 'src/interfaces/Store';

const initialState: ProjectState = {
  project_uuid: '',
  wpp_cloud_app_uuid: '',
  flows_channel_uuid: '',
  loadingSetup: false,
  setupError: false,
  agentLoading: false,
  wppLoading: false,
  featureLoading: false,
  updateFeatureLoading: [],
  disableFeatureLoading: false,
  agent: {
    name: '',
    links: [],
    occupation: '',
    objective: ''
  },
  featureList: [
    {
      uuid: 'a3d77bf9-1e06-44cb-a550-c691e6d44687',
      category: 'ACTIVE',
      code: 'order_status',
      isInTest: false
    },
    {
      uuid: '83fe991a-1677-45cf-9096-83fdbb086df7',
      category: 'ACTIVE',
      code: 'abandoned_cart',
      isInTest: false
    }
  ],
  integratedFeatures: []
}

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjectUuid: (state, action: PayloadAction<string>) => {
      state.project_uuid = action.payload;
    },
    setWppCloudAppUuid: (state, action: PayloadAction<string>) => {
      state.wpp_cloud_app_uuid = action.payload;
    },
    setFlowsChannelUuid: (state, action: PayloadAction<string>) => {
      state.flows_channel_uuid = action.payload;
    },
    setLoadingSetup: (state, action: PayloadAction<boolean>) => {
      state.loadingSetup = action.payload;
    },
    setSetupError: (state, action: PayloadAction<boolean>) => {
      state.setupError = action.payload;
    },
    setAgentLoading: (state, action: PayloadAction<boolean>) => {
      state.agentLoading = action.payload;
    },
    setWppLoading: (state, action: PayloadAction<boolean>) => {
      state.wppLoading = action.payload;
    },
    setFeatureLoading: (state, action: PayloadAction<boolean>) => {
      state.featureLoading = action.payload;
    },
    setAgent: (state, action: PayloadAction<Agent>) => {
      state.agent = action.payload;
    },
    setFeatureList: (state, action: PayloadAction<Feature[]>) => {
      state.featureList = action.payload;
    },
    setIntegratedFeatures: (state, action: PayloadAction<Feature[]>) => {
      state.integratedFeatures = action.payload;
    },
    setUpdateFeatureLoading: (state, action: PayloadAction<Loading>) => {
      const index = state.updateFeatureLoading.findIndex(
        (item) => item.feature_uuid === action.payload.feature_uuid
      );
    
      if (index !== -1) {
        state.updateFeatureLoading[index] = action.payload;
      } else {
        state.updateFeatureLoading.push(action.payload);
      }
    },
    
    setDisableFeatureLoading: (state, action: PayloadAction<boolean>) => {
      state.disableFeatureLoading = action.payload;
    },

  }
})

export const {
  setProjectUuid,
  setLoadingSetup,
  setSetupError,
  setWppCloudAppUuid,
  setFlowsChannelUuid,
  setAgentLoading,
  setAgent,
  setFeatureList,
  setWppLoading,
  setIntegratedFeatures,
  setFeatureLoading,
  setUpdateFeatureLoading,
  setDisableFeatureLoading
} = projectSlice.actions;

export const selectProject = (state: RootState) => state.project.project_uuid
export const wppCloudAppUuid = (state: RootState) => state.project.wpp_cloud_app_uuid
export const flowsChannelUuid = (state: RootState) => state.project.flows_channel_uuid
export const loadingSetup = (state: RootState) => state.project.loadingSetup
export const setupError = (state: RootState) => state.project.setupError
export const agentLoading = (state: RootState) => state.project.agentLoading
export const getAgent = (state: RootState) => state.project.agent
export const featureList = (state: RootState) => state.project.featureList
export const integratedFeatures = (state: RootState) => state.project.integratedFeatures
export const wppLoading = (state: RootState) => state.project.wppLoading
export const featureLoading = (state: RootState) => state.project.featureLoading
export const updateFeatureLoading = (state: RootState, feature_uuid: string) => state.project.updateFeatureLoading.find(feature => feature.feature_uuid === feature_uuid)
export const disableFeatureLoading = (state: RootState) => state.project.disableFeatureLoading
export default projectSlice.reducer;