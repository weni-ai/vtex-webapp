import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { Alert, Button, Flex, Heading, IconArrowUpRight, IconPlus, Page, PageContent, PageHeader, PageHeaderRow, PageHeading, Text, toast } from '@vtex/shoreline';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { ModalAgentPassiveDetails } from '../components/agent/ModalPassiveDetails';
import { AgentAssignModal } from '../components/agent/modals/Assign';
import { AgentsGalleryModal } from '../components/agent/modals/Gallery';
import { WhatsAppRequiredModal } from '../components/agent/modals/WhatsAppRequired';
import { AgentBox, AgentBoxContainer, AgentBoxSkeleton } from '../components/AgentBox';
import { AgentMetrics } from '../components/AgentMetrics';
import { RootState } from "../interfaces/Store";
import { assignAgentCLI, disableAgent, integrateAgent, updateAgentsList } from '../services/agent.service';
import { agents, hasTheFirstLoadOfTheAgentsHappened, selectProject, setAgents } from '../store/projectSlice';
import store from '../store/provider.store';
import { selectUser } from "../store/userSlice";
import getEnv from '../utils/env';

export function Dashboard() {
  const hasTheFirstLoadHappened = useSelector(hasTheFirstLoadOfTheAgentsHappened);
  const agentsListOriginal = useSelector(agents)
  const project_uuid = useSelector(selectProject)
  const userData = useSelector(selectUser);
  const projectUuid = useSelector((state: RootState) => state.project.project_uuid);
  const isWppIntegrated = useSelector((state: RootState) => state.user.isWhatsAppIntegrated);
  const [agentsRemoving, setAgentsRemoving] = useState<string[]>([]);
  const [updateAgentsListTimeout, setUpdateAgentsListTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isPassiveDetailsModalOpen, setIsPassiveDetailsModalOpen] = useState(false);
  const [isWhatsAppRequiredModalOpen, setIsWhatsAppRequiredModalOpen] = useState(false);
  const [isAgentAssignModalOpen, setIsAgentAssignModalOpen] = useState(false);
  const isAgentGalleryModalAccessEnabled = useFeatureIsOn('agentGalleryModalAccess');
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [agentUuid, setAgentUuid] = useState('');
  const [isAssigningAgent, setIsAssigningAgent] = useState(false);

  const agentsList = useMemo(() => {
    return agentsListOriginal.filter((item) => {
      if (isAgentGalleryModalAccessEnabled) {
        return item.isAssigned;
      }

      return ['commerce', 'nexus'].includes(item.origin);
    });
  }, [agentsListOriginal, isAgentGalleryModalAccessEnabled]);

  function navigateToAgent() {
    const dash = new URL(`/projects/${project_uuid}`, getEnv("VITE_APP_DASH_URL"));

    const VTEXAppParams = new URLSearchParams();

    if (userData?.user) {
      VTEXAppParams.append('email', userData.user);
    }

    dash.searchParams.append('vtex_app', VTEXAppParams.toString());

    window.open(dash.toString(), '_blank');
  }

  function assignedCommerceAgents() {
    return agentsList
      .filter((item) => item.isAssigned)
      .filter((item) => item.origin === 'commerce')
  }

  useEffect(() => {
    updateAgentsList();
  }, []);

  useEffect(() => {
    const rejectedAgents = assignedCommerceAgents().filter((item) => item.templateSynchronizationStatus === 'rejected');

    rejectedAgents.forEach(({ uuid }) => {
      tryRemoveAgent(uuid);
    });
  }, [agentsList]);

  useEffect(() => {
    const pendingAgents = assignedCommerceAgents().filter((item) => item.templateSynchronizationStatus === 'pending');

    if (pendingAgents.length > 0) {
      updateAgentsListSoon();
    }
  }, [agentsList]);

  async function tryRemoveAgent(uuid: string) {
    if (agentsRemoving.includes(uuid)) {
      return;
    }

    setAgentsRemoving((prev) => [...prev, uuid]);

    toast.critical(t('template_synchronization.rejected'));

    await disableAgent(project_uuid, uuid, 'commerce');

    setAgentsRemoving((prev) => prev.filter((item) => item !== uuid));
  }

  function updateAgentsListSoon() {
    if (updateAgentsListTimeout) {
      clearTimeout(updateAgentsListTimeout);
    }

    setUpdateAgentsListTimeout(setTimeout(async () => {
      await updateAgentsList();
    }, 3000));
  }

  async function handleAssign(uuid: string) {
    const agent = agentsListOriginal.find((item) => item.uuid === uuid);

    if (!agent) {
      return;
    }

    if (agent.origin === 'CLI') {
      setAgentUuid(uuid);
      setIsAgentAssignModalOpen(true);
    }

    if (agent.origin === 'commerce' && agent.notificationType === 'active') {
      if (isWppIntegrated) {
        integrateAgentInside(uuid);
      } else {
        setAgentUuid(uuid);
        setIsWhatsAppRequiredModalOpen(true);
      }
    }

    if (agent.origin === 'nexus' && agent.notificationType === 'passive') {
      await integrateAgentInside(uuid);

      const agentAfterIntegration = store.getState().project.agents.find((item) => item.uuid === uuid);

      if (agentAfterIntegration?.isAssigned && !isWppIntegrated) {
        const agentKeyPrefix = `agents.categories.${agentAfterIntegration.notificationType}.${agentAfterIntegration.code}`;

        const agentName =
          t(`${agentKeyPrefix}.title`) === `${agentKeyPrefix}.title`
            ? agent.name
            : t(`${agentKeyPrefix}.title`);

        const agentDescription =
          t(`${agentKeyPrefix}.description`) === `${agentKeyPrefix}.description`
            ? agent.description
            : t(`${agentKeyPrefix}.description`);

        setAgentName(agentName);
        setAgentDescription(agentDescription);
        setSkills(agent.skills);
        setIsPassiveDetailsModalOpen(true);
      }
    }
  }

  async function handleAssignCLI(data: { uuid: string, templatesUuids: string[], credentials: Record<string, string> }) {
    try {
      setIsAssigningAgent(true);

      await assignAgentCLI({
        uuid: data.uuid,
        templatesUuids: data.templatesUuids,
        credentials: data.credentials,
      });

      setIsAgentAssignModalOpen(false);

      toast.success(t('agent.actions.assign.success'));
    } catch (error) {
      toast.critical(t('agent.actions.assign.error'));
    } finally {
      setIsAssigningAgent(false);
    }
  }

  async function integrateAgentInside(uuid: string) {
    store.dispatch(setAgents(agentsListOriginal.map((item) => ({
      ...item,
      isAssigned: item.uuid === uuid ? true : item.isAssigned,
      isConfiguring: item.origin === 'commerce' && item.uuid === uuid ? true : (item.isConfiguring || false),
    }))));

    const result = await integrateAgent(uuid, projectUuid);

    if (result.error) {
      toast.critical(t('integration.error'));
    } else {
      toast.success(t('integration.success'));
    }
  }

  return (
    <Page>
      <PageHeader>
        <PageHeaderRow style={{ height: '44px' }}>
          <PageHeading >
            {t('title')}
          </PageHeading>
        </PageHeaderRow>
      </PageHeader>

      <PageContent style={{ margin: '0', maxWidth: '100vw' }}>
        <Flex direction='column' style={{ width: '100%' }}>
          <Alert
            variant="informational"
            style={{
              width: '100%',
            }}
          >
            <Flex
              align="center"
              justify="space-between"
              style={{
                width: '100%',
              }}
            >
              <Text variant="emphasis" color="$fg-base">
                {t('improve.description')}
              </Text>

              <Button variant="tertiary" style={{ flex: 'none', }} onClick={navigateToAgent}>
                <Text variant='action'> {t('improve.button')}</Text>
                <IconArrowUpRight
                  height="1rem"
                  width="1rem"
                  display="inline"
                  style={{
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    marginLeft: 'var(--sl-space-05)'
                  }}
                />
              </Button>
            </Flex>
          </Alert>

          <AgentMetrics />

          <Flex gap="$space-4" align="center" justify="space-between">
            <Heading
              variant="display2"
            >
              {t('agents.title')}
            </Heading>

            {isAgentGalleryModalAccessEnabled && (
              <Button variant="secondary" size="large" onClick={() => setIsGalleryModalOpen(true)}>
                <IconPlus />
                {t('agents.buttons.gallery')}
              </Button>
            )}
          </Flex>

          <AgentBoxContainer>
            {!hasTheFirstLoadHappened && (
              <AgentBoxSkeleton count={2} />
            )}

            {hasTheFirstLoadHappened && (
              agentsList.map((item) => (
                <AgentBox
                  key={item.uuid}
                  name={item.name || ''}
                  description={item.description || ''}
                  uuid={item.uuid}
                  code={item.code as 'order_status' | 'abandoned_cart'}
                  type={item.notificationType}
                  isIntegrated={item.isAssigned}
                  origin={item.origin || 'commerce'}
                  isInTest={item.isInTest}
                  isConfiguring={item.isConfiguring || false}
                  skills={item.skills || []}
                  onAssign={handleAssign}
                />
              ))
            )}
          </AgentBoxContainer>
        </Flex>

        <AgentsGalleryModal
          open={isGalleryModalOpen}
          onClose={() => setIsGalleryModalOpen(false)}
          onAssign={handleAssign}
        />

        <WhatsAppRequiredModal
          open={isWhatsAppRequiredModalOpen}
          onClose={() => setIsWhatsAppRequiredModalOpen(false)}
          isLoading={false}
          onConfirm={() => {
            integrateAgentInside(agentUuid);
            setIsWhatsAppRequiredModalOpen(false);
          }}
        />

        <ModalAgentPassiveDetails
          open={isPassiveDetailsModalOpen}
          onClose={() => setIsPassiveDetailsModalOpen(false)}
          agentName={agentName}
          agentDescription={agentDescription}
          skills={skills}
        />

        <AgentAssignModal
          open={isAgentAssignModalOpen}
          agentUuid={agentUuid}
          onClose={() => setIsAgentAssignModalOpen(false)}
          onViewAgentsGallery={() => {
            setIsAgentAssignModalOpen(false);
            setIsGalleryModalOpen(true);
          }}
          onAssign={handleAssignCLI}
          isAssigningAgent={isAssigningAgent}
        />
      </PageContent>
    </Page>
  )
}
