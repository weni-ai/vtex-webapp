/* eslint-disable @typescript-eslint/no-explicit-any */
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
    [key: string]: any;
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
    setupError: boolean;
    agentLoading: boolean;
    wppLoading: boolean;
    featureLoading: boolean;
    agent: Agent;
    featureList: Feature[];
    integratedFeatures: Feature[];
    updateFeatureLoading: Loading[];
    disableFeatureLoading: boolean;
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
    [key: string]: any;
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