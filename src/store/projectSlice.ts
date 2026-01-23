import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Agent, Loading, ProjectState, RootState } from 'src/interfaces/Store';
import { cleanURL } from '../utils';

const initialState: ProjectState = {
  project_uuid: '',
  wpp_cloud_app_uuid: '',
  flows_channel_uuid: '',
  loadingSetup: false,
  setupError: false,
  agentBuilderLoading: false,
  wppLoading: false,
  agentsLoading: [],
  updateAgentLoading: false,
  disableAgentLoading: false,
  agentBuilder: {
    name: '',
    links: [],
    occupation: '',
    objective: '',
    channel: ''
  },
  hasTheFirstLoadOfTheAgentsHappened: false,
  agents: [],
  storeType: '',
  initialLoading: false,
  WhatsAppURL: '',
  templateLanguages: null,
  assignedAgents: [],
}

interface AssignedAgent {
  uuid: string;
  webhookUrl: string;
  channelUuid: string;
  contactPercentage: number;
  globalRule: string;
  hasDeliveredOrderTemplates: boolean;
  deliveredOrderTrackingConfig: {
    isEnabled: boolean;
    appKey: string;
    webhookUrl: string;
  };
  templates: {
    uuid: string;
    name: string;
    startCondition: string;
    status: "active" | "pending" | "rejected" | "in_appeal" | "pending_deletion" | "deleted" | "disabled" | "locked" | "needs-editing";
    isCustom: boolean;
    variables: {
      definition: string;
      fallback: string;
    }[];
    metadata: {
      body: string;
      body_params: string[];
      header: string;
      footer: string;
      buttons: {
        type: 'URL';
        text: string;
        url: string;
      }[];
    };
  }[];
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
    setAgentsLoading: (state, action: PayloadAction<Loading[]>) => {
      state.agentsLoading = action.payload;
    },
    setAgentBuilder: (state, action: PayloadAction<Agent>) => {
      state.agentBuilder = {
        ...action.payload,
        links: action.payload.links.map(cleanURL),
      };
    },
    setHasTheFirstLoadOfTheAgentsHappened: (state, action: PayloadAction<boolean>) => {
      state.hasTheFirstLoadOfTheAgentsHappened = action.payload;
    },
    setUpdateAgentLoading: (state, action: PayloadAction<boolean>) => {
      state.updateAgentLoading = action.payload;
    },

    setDisableAgentLoading: (state, action: PayloadAction<boolean>) => {
      state.disableAgentLoading = action.payload;
    },
    setStoreType: (state, action: PayloadAction<string>) => {
      state.storeType = action.payload;
    },
    setInitialLoading: (state, action: PayloadAction<boolean>) => {
      state.initialLoading = action.payload;
    },
    setWhatsAppURL: (state, action: PayloadAction<string>) => {
      state.WhatsAppURL = action.payload;
    },
    setTemplateLanguages: (state, action: PayloadAction<{ code: string; display_name: string }[]>) => {
      state.templateLanguages = action.payload;
    },
    setAgents: (state, action: PayloadAction<(AgentCommerce | AgentNexus | AgentCLI)[]>) => {
      state.agents = action.payload;
    },
    addAssignedAgent: (state, action: PayloadAction<AssignedAgent>) => {
      state.assignedAgents = [...state.assignedAgents.filter((agent) => agent.uuid !== action.payload.uuid), action.payload];
    },
    setAssignedAgents: (state, action: PayloadAction<AssignedAgent[]>) => {
      state.assignedAgents = action.payload;
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
  setHasTheFirstLoadOfTheAgentsHappened,
  setAgents,
  setAgentsLoading,
  setUpdateAgentLoading,
  setDisableAgentLoading,
  setWppLoading,
  setStoreType,
  setInitialLoading,
  setWhatsAppURL,
  setTemplateLanguages,
  addAssignedAgent,
  setAssignedAgents,
} = projectSlice.actions;

export const selectProject = (state: RootState) => state.project.project_uuid
export const wppCloudAppUuid = (state: RootState) => state.project.wpp_cloud_app_uuid
export const flowsChannelUuid = (state: RootState) => state.project.flows_channel_uuid
export const loadingSetup = (state: RootState) => state.project.loadingSetup
export const setupError = (state: RootState) => state.project.setupError
export const agentBuilderLoading = (state: RootState) => state.project.agentBuilderLoading
export const getAgentBuilder = (state: RootState) => state.project.agentBuilder
export const getAgentChannel = (state: RootState) => state.project.agentBuilder.channel
export const hasTheFirstLoadOfTheAgentsHappened = (state: RootState) => state.project.hasTheFirstLoadOfTheAgentsHappened
export const agents = (state: RootState) => state.project.agents
export const wppLoading = (state: RootState) => state.project.wppLoading
export const agentsLoading = (state: RootState) => state.project.agentsLoading
export const updateAgentLoading = (state: RootState) => state.project.updateAgentLoading
export const disableAgentLoading = (state: RootState) => state.project.disableAgentLoading
export const initialLoading = (state: RootState) => state.project.initialLoading
export default projectSlice.reducer;
