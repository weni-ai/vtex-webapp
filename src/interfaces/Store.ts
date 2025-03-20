export interface AuthState {
    token: string;
    base_address: string;
}

export interface Agent {
    name: string;
    links: string[];
    occupation: string;
    objective: string;
    channel: string;
}

export interface Feature {
    uuid: string;
    category: 'ACTIVE' | 'PASSIVE';
    code: 'order_status' | 'abandoned_cart';
    isInTest: boolean;
}

export interface Loading {
    feature_uuid: string,
    isLoading: boolean
}

export interface ProjectState {
    project_uuid: string;
    wpp_cloud_app_uuid: string;
    flows_channel_uuid: string;
    loadingSetup: boolean;
    agentBuilderLoading: boolean;
    agentsLoading: boolean;
    updateAgentLoading: boolean;
    disableAgentLoading: boolean;
    agentBuilder: Agent;
    setupError: boolean;
    wppLoading: boolean;
    agents: Feature[];
    integratedAgents: Feature[];
}

export interface UserData {
    userId: string;
    user: string;
    userType: string;
    tokenType: string;
    account: string;
    audience: string;
    isRepresentative: boolean;
}

export interface AccountData {
    hosts:  string[];
}
  

export interface UserState {
    userData: UserData | null;
    accountData: AccountData | null;
    loadingWhatsAppIntegration: boolean;
    isWhatsAppIntegrated: boolean;
    isAgentIntegrated: boolean;
    isFeatureIntegrated: boolean;
    whatsAppError: string | null;
}

export interface RootState {
    auth: AuthState;
    project: ProjectState,
    user: UserState
}