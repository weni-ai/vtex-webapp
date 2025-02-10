/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

const projectSlice = createSlice({
    name: 'project',
    initialState: {
      project_uuid: null,
      wpp_cloud_app_uuid: null,
      flows_channel_uuid: null,
      loadingSetup: false,
      setupError: false,
      agentLoading: false,
      wppLoading: false,
      agent: {
        name: '',
        links: [],
        occupation: '',
        objective: ''
      },
      featureList: [{
        feature_uuid: '82738123',
        code: 'order-status',
        restrict_test: true
      },
      {
        feature_uuid: '827381ede23',
        code: 'abandoned-cart'

      }],
      integratedFeatures: [] as any[]
    },
    reducers: {
      setProjectUuid: (state, action) => {
        state.project_uuid = action.payload
      },
      setWppCloudAppUuid: (state, action) => {
        state.wpp_cloud_app_uuid = action.payload
      },
      setFlowsChannelUuid: (state, action) => {
        state.flows_channel_uuid = action.payload
      },
      setLoadingSetup: (state, action) => {
        state.loadingSetup = action.payload
      },
      setSetupError: (state, action) => {
        state.setupError = action.payload
      },
      setAgentLoading: (state, action) => {
        state.agentLoading = action.payload
      },
      setWppLoading: (state, action) => {
        state.wppLoading = action.payload
      },
      setAgent: (state, action) => {
        state.agent = action.payload
      },
      setFeatureList: (state, action) => {
        state.featureList = action.payload
      },
      setIntegratedFeatures: (state, action) => {
        state.integratedFeatures = action.payload
      }
    }
  })

  export const {setProjectUuid, setLoadingSetup, setSetupError, setWppCloudAppUuid, setFlowsChannelUuid, setAgentLoading, setAgent, setFeatureList, setWppLoading, setIntegratedFeatures} = projectSlice.actions
  export const selectProject = (state: any) => state.project.project_uuid
  export const wppCloudAppUuid = (state: any) => state.project.wpp_cloud_app_uuid
  export const flowsChannelUuid = (state: any) => state.project.flows_channel_uuid
  export const loadingSetup = (state: any) => state.project.loadingSetup
  export const setupError = (state: any) => state.project.setupError
  export const agentLoading = (state: any) => state.project.agentLoading
  export const getAgent = (state: any) => state.project.agent
  export const featureList = (state: any) => state.project.featureList
  export const wppLoading = (state: any) => state.project.wppLoading
  export default projectSlice.reducer;