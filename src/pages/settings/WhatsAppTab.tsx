import { Divider, Flex, Heading, IconPlus, Skeleton, Text, toast, IconUser } from '@vtex/shoreline';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/adapters/Button';
import { AgentBoxContainer, AgentBoxEmpty, AgentBoxSkeleton } from '../../components/AgentBox';
import { CLIAgentCard } from '../../components/settings/CLIAgentCard';
import { AgentsGalleryModal } from '../../components/agent/modals/Gallery';
import { AgentAssignModal } from '../../components/agent/modals/Assign';
import { openPlatformUrl } from '../../utils/platform';
import { assignAgentCLI } from '../../services/agent.service';
import { useWhatsAppData } from './useWhatsAppData';

interface WhatsAppProfile {
  displayName: string;
  displayPhoneNumber: string;
}

const profileCardStyle: React.CSSProperties = {
  border: 'var(--sl-border-base)',
  borderRadius: 'var(--sl-radius-2)',
  padding: '16px',
};

const avatarContainerStyle: React.CSSProperties = {
  width: '50px',
  height: '50px',
  flexShrink: 0,
  borderRadius: '50%',
  border: 'var(--sl-border-base)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

function WhatsAppProfileCard({ profile, isLoading }: { profile: WhatsAppProfile | null; isLoading: boolean }) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Flex direction="column" gap="$space-4">
        <Heading variant="display3">{t('settings.whatsapp.profile.title')}</Heading>
        <Flex gap="$space-4" align="center" style={profileCardStyle}>
          <Skeleton style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
          <Flex direction="column" gap="$space-2" style={{ flex: 1 }}>
            <Skeleton style={{ height: '20px', width: '40%' }} />
            <Skeleton style={{ height: '20px', width: '60%' }} />
          </Flex>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="$space-4">
      <Heading variant="display3">{t('settings.whatsapp.profile.title')}</Heading>
      <Flex gap="$space-4" align="center" style={profileCardStyle}>
        <Flex gap="$space-4" align="center" style={{ flex: '1 1 0', minWidth: 0 }}>
          <Flex align="center" justify="center" style={avatarContainerStyle}>
            <IconUser />
          </Flex>

          <Flex direction="column" gap="$space-1">
            <Text variant="emphasis" color="$fg-base">
              {profile?.displayName || '—'}
            </Text>
            <Text variant="body" color="$fg-base-soft">
              {profile?.displayPhoneNumber || '—'}
            </Text>
          </Flex>
        </Flex>

        <Button variant="tertiary" size="normal" onClick={() => openPlatformUrl('/integrations/apps/my')}>
          {t('settings.whatsapp.profile.edit')}
        </Button>
      </Flex>
    </Flex>
  );
}

export function WhatsAppTab() {
  const { t } = useTranslation();
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedAgentUuid, setSelectedAgentUuid] = useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAssigningAgent, setIsAssigningAgent] = useState(false);

  const {
    hasWhatsApp,
    whatsAppProfile,
    whatsAppProfileLoading,
    cliAgents,
    hasFirstLoadHappened,
  } = useWhatsAppData();

  function handleSelectAgent(uuid: string) {
    setSelectedAgentUuid(uuid);
    setIsAssignModalOpen(true);
  }

  async function handleAssignCLI(data: { uuid: string; templatesUuids: string[]; credentials: Record<string, string> }) {
    try {
      setIsAssigningAgent(true);

      await assignAgentCLI({
        uuid: data.uuid,
        templatesUuids: data.templatesUuids,
        credentials: data.credentials,
      });

      setIsAssignModalOpen(false);
      toast.success(t('integration.success'));
    } catch (error) {
      toast.critical(error instanceof Error ? error.message : t('common.errors.unexpected_error'));
    } finally {
      setIsAssigningAgent(false);
    }
  }

  return (
    <Flex direction="column" gap="$space-5" style={{ width: '100%', marginTop: '$space-5' }}>
      {hasWhatsApp && (
        <>
          <WhatsAppProfileCard profile={whatsAppProfile} isLoading={whatsAppProfileLoading} />
          <Divider />
        </>
      )}

      <Flex direction="column" gap="$space-5">
        <Flex align="center" justify="space-between">
          <Heading variant="display2">{t('settings.whatsapp.automations.title')}</Heading>

          <Button variant="secondary" size="large" onClick={() => setIsGalleryModalOpen(true)}>
            <IconPlus />
            {t('settings.whatsapp.automations.connect')}
          </Button>
        </Flex>

        {!hasFirstLoadHappened && (
          <AgentBoxContainer>
            <AgentBoxSkeleton count={3} />
          </AgentBoxContainer>
        )}

        {hasFirstLoadHappened && cliAgents.length === 0 && <AgentBoxEmpty />}

        {hasFirstLoadHappened && cliAgents.length > 0 && (
          <AgentBoxContainer>
            {cliAgents.map((agent) => {
              if (!agent.isAssigned) return null;
              return (
                <CLIAgentCard
                  key={agent.uuid}
                  uuid={agent.uuid}
                  name={agent.name || ''}
                  description={agent.description || ''}
                  code={agent.code}
                  type={agent.notificationType}
                  assignedAgentUuid={(agent as AgentCLI).assignedAgentUuid}
                />
              );
            })}
          </AgentBoxContainer>
        )}
      </Flex>

      <AgentsGalleryModal
        open={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        onAssign={handleSelectAgent}
        originFilter="CLI"
      />

      <AgentAssignModal
        origin="CLI"
        open={isAssignModalOpen}
        agentUuid={selectedAgentUuid}
        onClose={() => setIsAssignModalOpen(false)}
        onViewAgentsGallery={() => {
          setIsAssignModalOpen(false);
          setIsGalleryModalOpen(true);
        }}
        onAssign={handleAssignCLI}
        isAssigningAgent={isAssigningAgent}
      />
    </Flex>
  );
}
