/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AuthState {
    token: string;
    base_address: string;
}

export interface AgentBuilder {
    name: string;
    links: string[];
    occupation: string;
    objective: string;
    channel: {
        uuid: string;
        name: string;
    };
}

export interface Agents {
    uuid: string;
    category: 'ACTIVE' | 'PASSIVE';
    code: 'order_status' | 'abandoned_cart';
    isInTest: boolean;
    isConfiguring: boolean;
    phone_numbers: string[];
    message_time_restrictions?: {
        is_active: boolean;
        periods: {
            weekdays: { from: string; to: string };
            saturdays: { from: string; to: string };
        };
    };
}

export interface Loading {
    agent_uuid: string,
    isLoading: boolean
}
export interface ProjectState {
    project_uuid: string;
    wpp_cloud_app_uuid: string;
    flows_channel_uuid: string;
    loadingSetup: boolean;
    setupError: boolean;
    agentBuilderLoading: boolean;
    wppLoading: boolean;
    agentsLoading: Loading[];
    agents: Agents[];
    integratedAgents: Agents[];
    updateAgentLoading: boolean;
    disableAgentLoading: boolean;
    agentBuilder: AgentBuilder;
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
    hosts: string[];
    [key: string]: any;
}


export interface UserState {
    userData: UserData | null;
    accountData: AccountData | null;
    loadingWhatsAppIntegration: boolean;
    isWhatsAppIntegrated: boolean;
    isAgentBuilderIntegrated: boolean;
    whatsAppError: string | null;
}

export interface RootState {
    auth: AuthState;
    project: ProjectState,
    user: UserState
}