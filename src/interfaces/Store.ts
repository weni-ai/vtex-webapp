export interface AuthState {
    token: string;
    base_address: string;
}

export interface Agent {
    name: string;
    links: string[];
    occupation: string;
    objective: string;
}

export interface Feature {
    feature_uuid: string;
    name: string;
    description: string;
    disclaimer: string;
    code: string;
}

export interface ProjectState {
    project_uuid: string;
    wpp_cloud_app_uuid: string;
    flows_channel_uuid: string;
    loadingSetup: boolean;
    setupError: boolean;
    agentLoading: boolean;
    wppLoading: boolean;
    featureLoading: boolean;
    agent: Agent;
    featureList: Feature[];
    integratedFeatures: Feature[];
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

export interface UserState {
    userData: UserData | null;
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