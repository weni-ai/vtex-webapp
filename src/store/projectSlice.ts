/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Agent, Feature, ProjectState, RootState } from 'src/interfaces/Store';

const initialState: ProjectState = {
  project_uuid: '',
  wpp_cloud_app_uuid: '',
  flows_channel_uuid: '',
  loadingSetup: false,
  setupError: false,
  agentLoading: false,
  wppLoading: false,
  featureLoading: false,
  agent: {
    name: '',
    links: [],
    occupation: '',
    objective: ''
  },
  featureList: [
    {
      feature_uuid: 'a3d77bf9-1e06-44cb-a550-c691e6d44687',
      name: 'Order status change notification',
      description: 'Solution that notifies the customer whenever the order status changes (BR)',
      disclaimer: '',
      code: 'order-status',
    },
    {
      feature_uuid: '83fe991a-1677-45cf-9096-83fdbb086df7',
      name: 'Opinionated Abandoned Cart',
      description: 'A pre-configured solution for abandoned cart notifications, without user input.',
      disclaimer: '',
      code: 'abandoned-cart',
    }
  ],
  integratedFeatures: []
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers:{
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
    }
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
  setFeatureLoading 
} = projectSlice.actions;

export const selectProject = (state: RootState) => state.project.project_uuid
export const wppCloudAppUuid = (state: RootState) => state.project.wpp_cloud_app_uuid
export const flowsChannelUuid = (state: RootState) => state.project.flows_channel_uuid
export const loadingSetup = (state: RootState) => state.project.loadingSetup
export const setupError = (state: RootState) => state.project.setupError
export const agentLoading = (state: RootState) => state.project.agentLoading
export const getAgent = (state: RootState) => state.project.agent
export const featureList = (state: RootState) => state.project.featureList
export const wppLoading = (state: RootState) => state.project.wppLoading
export const featureLoading = (state: RootState) => state.project.featureLoading
export default projectSlice.reducer;