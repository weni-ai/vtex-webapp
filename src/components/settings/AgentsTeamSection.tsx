import { Flex, Heading, IconPlus, Skeleton, Tag, Text, toast } from '@vtex/shoreline';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from '../adapters/Button';
import { AgentBoxContainer, AgentBoxSkeleton } from '../AgentBox';
import { AgentsGalleryModal } from '../agent/modals/Gallery';
import { AgentAssignModal } from '../agent/modals/Assign';
import { ModalAgentPassiveDetails } from '../agent/ModalPassiveDetails';
import { Instructions } from '../manager/Instructions';
import { NexusAgentCard } from './NexusAgentCard';
import { openPlatformUrl } from '../../utils/platform';
import { integrateAgent } from '../../services/agent.service';
import { agents as agentsSelector, selectProject, setAgents } from '../../store/projectSlice';
import store from '../../store/provider.store';
import { RootState } from '../../interfaces/Store';
import IconCancellation from '../../assets/icons/cancellation.svg';

interface ManagerInfo {
  name: string;
  goal: string;
}

interface AgentsTeamSectionProps {
  managerInfo: ManagerInfo | null;
  managerInfoLoading: boolean;
  nexusAgents: (AgentNexus | AgentCommerce | AgentCLI)[];
  hasFirstLoadHappened: boolean;
}

const managerCardStyle: React.CSSProperties = {
  border: 'var(--sl-border-base)',
  borderRadius: 'var(--sl-radius-2)',
  padding: '16px',
};

const managerAvatarContainerStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  flexShrink: 0,
};

const truncatedTextStyle: React.CSSProperties = {
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical' as const,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

function ManagerInfoCard({ managerInfo, isLoading }: { managerInfo: ManagerInfo | null; isLoading: boolean }) {
  const { t } = useTranslation();

  function handleEdit() {
    openPlatformUrl('/ai-build/build/instructions');
  }

  if (isLoading) {
    return (
      <Flex gap="$space-4" align="center" style={managerCardStyle}>
        <Skeleton style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
        <Flex direction="column" gap="$space-2" style={{ flex: 1 }}>
          <Skeleton style={{ height: '20px', width: '40%' }} />
          <Skeleton style={{ height: '40px', width: '100%' }} />
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex gap="$space-4" align="center" style={managerCardStyle}>
      <Flex gap="$space-4" align="center" style={{ flex: '1 1 0', minWidth: 0 }}>
        <Flex align="center" justify="center" style={managerAvatarContainerStyle}>
          <img src={IconCancellation} alt="" style={{ width: '40px', height: '40px' }} />
        </Flex>

        <Flex direction="column" gap="$space-2" style={{ flex: '1 1 0', minWidth: 0 }}>
          <Flex gap="$space-1" align="center">
            <Text variant="emphasis" color="$fg-base" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {managerInfo?.name || '—'}
            </Text>
            <Tag color="blue" variant="secondary">
              {t('settings.agents_team.manager_tag')}
            </Tag>
          </Flex>

          <Text variant="body" color="$fg-base-soft" style={truncatedTextStyle} title={managerInfo?.goal}>
            {managerInfo?.goal || '—'}
          </Text>
        </Flex>
      </Flex>

      <Button variant="tertiary" size="normal" onClick={handleEdit}>
        {t('settings.agents_team.edit')}
      </Button>
    </Flex>
  );
}

export function AgentsTeamSection({ managerInfo, managerInfoLoading, nexusAgents, hasFirstLoadHappened }: AgentsTeamSectionProps) {
  const { t } = useTranslation();
  const projectUuid = useSelector(selectProject);
  const agentsListOriginal = useSelector(agentsSelector);
  const isWppIntegrated = useSelector((state: RootState) => state.user.isWhatsAppIntegrated);

  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isAgentAssignModalOpen, setIsAgentAssignModalOpen] = useState(false);
  const [isPassiveDetailsModalOpen, setIsPassiveDetailsModalOpen] = useState(false);
  const [isAssigningAgent, setIsAssigningAgent] = useState(false);

  const [agentUuid, setAgentUuid] = useState('');
  const [passiveDetailsName, setPassiveDetailsName] = useState('');
  const [passiveDetailsDescription, setPassiveDetailsDescription] = useState('');
  const [passiveDetailsSkills, setPassiveDetailsSkills] = useState<string[]>([]);

  function handleAssign(uuid: string) {
    setAgentUuid(uuid);
    setIsAgentAssignModalOpen(true);
  }

  async function integrateAgentInside(uuid: string) {
    store.dispatch(setAgents(agentsListOriginal.map((item) => ({
      ...item,
      isAssigned: item.uuid === uuid || item.isAssigned,
      isActive: item.uuid === uuid || item.isActive,
      isConfiguring: (item.origin === 'commerce' && item.uuid === uuid) || !!item.isConfiguring,
    }))));

    const result = await integrateAgent(uuid, projectUuid);

    if (result.error) {
      toast.critical(t('integration.error'));
    } else {
      toast.success(t('integration.success'));
    }
  }

  async function assignPassiveAgent(uuid: string) {
    const agent = agentsListOriginal.find((item) => item.uuid === uuid);

    if (!agent) return;

    await integrateAgentInside(uuid);

    const agentAfterIntegration = store.getState().project.agents.find((item) => item.uuid === uuid);

    if (agentAfterIntegration?.isAssigned && !isWppIntegrated) {
      const agentKeyPrefix = `agents.categories.${agentAfterIntegration.notificationType}.${agentAfterIntegration.code}`;

      const resolvedName =
        t(`${agentKeyPrefix}.title`) === `${agentKeyPrefix}.title`
          ? agent.name
          : t(`${agentKeyPrefix}.title`);

      const resolvedDescription =
        t(`${agentKeyPrefix}.description`) === `${agentKeyPrefix}.description`
          ? agent.description
          : t(`${agentKeyPrefix}.description`);

      setPassiveDetailsName(resolvedName);
      setPassiveDetailsDescription(resolvedDescription);
      setPassiveDetailsSkills(agent.skills || []);
      setIsPassiveDetailsModalOpen(true);
    }
  }

  async function handleAssignConfirm(data: { uuid: string; type: 'active' | 'passive'; templatesUuids: string[]; credentials: Record<string, string> }) {
    if (data.type === 'passive') {
      setIsAssigningAgent(true);
      await assignPassiveAgent(data.uuid);
      setIsAgentAssignModalOpen(false);
      setIsAssigningAgent(false);
      return;
    }

    setIsAssigningAgent(true);
    try {
      await integrateAgentInside(data.uuid);
      setIsAgentAssignModalOpen(false);
    } finally {
      setIsAssigningAgent(false);
    }
  }

  return (
    <Flex direction="column" gap="$space-5">
      <Flex gap="$space-5" align="center" justify="space-between">
        <Heading variant="display2">
          {t('settings.agents_team.title')}
        </Heading>

        <Flex gap="$space-4" align="center">
          <Instructions />

          <Button variant="primary" size="large" onClick={() => setIsGalleryModalOpen(true)}>
            <IconPlus />
            {t('settings.agents_team.assign_agents')}
          </Button>
        </Flex>
      </Flex>

      <Flex direction="column" gap="$space-4">
        <ManagerInfoCard managerInfo={managerInfo} isLoading={managerInfoLoading} />

        {!hasFirstLoadHappened && (
          <AgentBoxContainer>
            <AgentBoxSkeleton count={3} />
          </AgentBoxContainer>
        )}

        {hasFirstLoadHappened && nexusAgents.length > 0 && (
          <AgentBoxContainer>
            {nexusAgents.map((agent) => {
              if (!agent.isAssigned) return null;
              return (
                <NexusAgentCard
                  key={agent.uuid}
                  uuid={agent.uuid}
                  name={agent.name}
                  description={agent.description}
                  code={agent.code}
                  isActive={agent.isActive}
                  isOfficial={agent.isOfficial}
                />
              );
            })}
          </AgentBoxContainer>
        )}
      </Flex>

      <AgentsGalleryModal
        open={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        onAssign={handleAssign}
        originFilter="nexus"
      />

      <AgentAssignModal
        origin="nexus"
        open={isAgentAssignModalOpen}
        agentUuid={agentUuid}
        onClose={() => setIsAgentAssignModalOpen(false)}
        onViewAgentsGallery={() => {
          setIsAgentAssignModalOpen(false);
          setIsGalleryModalOpen(true);
        }}
        onAssign={handleAssignConfirm}
        isAssigningAgent={isAssigningAgent}
      />

      <ModalAgentPassiveDetails
        open={isPassiveDetailsModalOpen}
        onClose={() => setIsPassiveDetailsModalOpen(false)}
        agentName={passiveDetailsName}
        agentDescription={passiveDetailsDescription}
        skills={passiveDetailsSkills}
      />
    </Flex>
  );
}
