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
        abandonedCartAbandonmentTimeMinutes?: number;
        abandonedCartMinimumCartValue?: number;
        abandonedCartHeaderImageType?: 'no_image' | 'first_image';
        templates: {
            uuid: string;
            name: string;
            isCustom: boolean;
            startCondition: string;
            status: "active" | "pending" | "rejected" | "in_appeal" | "pending_deletion" | "deleted" | "disabled" | "locked" | "needs-editing";
            variables: { definition: string; fallback: string; }[];
            metadata: {
                body: string;
                body_params: string[];
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
        hasDeliveredOrderTemplates: boolean;
        deliveredOrderTrackingConfig: {
            isEnabled: boolean;
            appKey: string;
            webhookUrl: string;
        };
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

export interface AppState {
    designSystem: 'shoreline' | 'unnnic';
    embeddedWithin: 'VTEX App' | 'Weni Platform';
}

export interface RootState {
    auth: AuthState;
    project: ProjectState,
    user: UserState,
    app: AppState,
}