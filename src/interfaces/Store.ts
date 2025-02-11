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

export interface RootState {
    auth: AuthState;
    project: ProjectState
}