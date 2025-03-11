
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AgentBuilder, Agents, Loading, ProjectState, RootState } from 'src/interfaces/Store';

const initialState: ProjectState = {
  project_uuid: '',
  wpp_cloud_app_uuid: '',
  flows_channel_uuid: '',
  loadingSetup: false,
  setupError: false,
  agentBuilderLoading: false,
  wppLoading: false,
  agentsLoading: false,
  updateAgentLoading: [],
  disableAgentLoading: false,
  agentBuilder: {
    name: '',
    links: [],
    occupation: '',
    objective: '',
    channel: 'faststore'
  },
  agents: [],
  integratedAgents: []
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
    setAgentBuilderLoading: (state, action: PayloadAction<boolean>) => {
      state.agentBuilderLoading = action.payload;
    },
    setWppLoading: (state, action: PayloadAction<boolean>) => {
      state.wppLoading = action.payload;
    },
    setAgentsLoading: (state, action: PayloadAction<boolean>) => {
      state.agentsLoading = action.payload;
    },
    setAgentBuilder: (state, action: PayloadAction<AgentBuilder>) => {
      state.agentBuilder = action.payload;
    },
    setAgents: (state, action: PayloadAction<Agents[]>) => {
      state.agents = action.payload;
    },
    setIntegratedAgents: (state, action: PayloadAction<Agents[]>) => {
      state.integratedAgents = action.payload;
    },
    setUpdateAgentLoading: (state, action: PayloadAction<Loading>) => {
      const index = state.updateAgentLoading.findIndex(
        (item) => item.agent_uuid === action.payload.agent_uuid
      );
    
      if (index !== -1) {
        state.updateAgentLoading[index] = action.payload;
      } else {
        state.updateAgentLoading.push(action.payload);
      }
    },

    setDisableAgentLoading: (state, action: PayloadAction<boolean>) => {
      state.disableAgentLoading = action.payload;
    },

  }
})

export const {
  setProjectUuid,
  setLoadingSetup,
  setSetupError,
  setWppCloudAppUuid,
  setFlowsChannelUuid,
  setAgentBuilderLoading,
  setAgentBuilder,
  setAgents,
  setAgentsLoading,
  setIntegratedAgents,
  setUpdateAgentLoading,
  setDisableAgentLoading,
  setWppLoading
} = projectSlice.actions;

export const selectProject = (state: RootState) => state.project.project_uuid
export const wppCloudAppUuid = (state: RootState) => state.project.wpp_cloud_app_uuid
export const flowsChannelUuid = (state: RootState) => state.project.flows_channel_uuid
export const loadingSetup = (state: RootState) => state.project.loadingSetup
export const setupError = (state: RootState) => state.project.setupError
export const agentBuilderLoading = (state: RootState) => state.project.agentBuilderLoading
export const getAgentBuilder = (state: RootState) => state.project.agentBuilder
export const getAgentChannel = (state: RootState) => state.project.agentBuilder.channel
export const agents = (state: RootState) => state.project.agents
export const integratedAgents = (state: RootState) => state.project.integratedAgents
export const wppLoading = (state: RootState) => state.project.wppLoading
export const agentsLoading = (state: RootState) => state.project.agentsLoading
export const updateAgentLoading = (state: RootState, agent_uuid: string) => state.project.updateAgentLoading.find(agent => agent.agent_uuid === agent_uuid)
export const disableAgentLoading = (state: RootState) => state.project.disableAgentLoading
export default projectSlice.reducer;