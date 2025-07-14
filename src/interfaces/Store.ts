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

export interface Loading {
    agent_uuid: string,
    isLoading: boolean
}

export interface ProjectState {
    project_uuid: string;
    wpp_cloud_app_uuid: string;
    flows_channel_uuid: string;
    loadingSetup: boolean;
    agentBuilderLoading: boolean;
    agentsLoading: Loading[];
    updateAgentLoading: boolean;
    disableAgentLoading: boolean;
    agentBuilder: Agent;
    setupError: boolean;
    wppLoading: boolean;
    hasTheFirstLoadOfTheAgentsHappened: boolean;
    agents: (AgentCommerce | AgentNexus | AgentCLI)[];
    storeType: string;
    initialLoading: boolean;
    WhatsAppURL: string;
    assignedAgents: {
        uuid: string;
        webhookUrl: string;
        contactPercentage: number;
        templates: {
            uuid: string;
            name: string;
            startCondition: string;
            status: "active" | "pending" | "rejected" | "in_appeal" | "pending_deletion" | "deleted" | "disabled" | "locked" | "needs-editing";
            metadata: {
                body: string;
                header: string;
                footer: string;
                buttons: {
                    type: 'URL';
                    text: string;
                    url: string;
                    example?: string[];
                }[];
            };
        }[];
        channelUuid: string;
        globalRule: string;
    }[];
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
    accountName: string;
    hosts:  string[];
}
  

export interface UserState {
    userData: UserData | null;
    accountData: AccountData | null;
    loadingWhatsAppIntegration: boolean;
    isWhatsAppIntegrated: boolean;
    isAgentBuilderIntegrated: boolean;
    whatsAppError: string | null;
    WhatsAppPhoneNumber: string | null;
}

export interface RootState {
    auth: AuthState;
    project: ProjectState,
    user: UserState
}