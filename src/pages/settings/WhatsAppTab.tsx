import { Divider, Flex, Heading, IconPlus, toast } from '@vtex/shoreline';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/adapters/Button';
import { AgentBoxContainer, AgentBoxEmpty, AgentBoxSkeleton } from '../../components/AgentBox';
import { CLIAgentCard } from '../../components/settings/CLIAgentCard';
import { AgentsGalleryModal } from '../../components/agent/modals/Gallery';
import { AgentAssignModal } from '../../components/agent/modals/Assign';
import { openPlatformUrl } from '../../utils/platform';
import { assignAgentCLI } from '../../services/agent.service';
import { WhatsAppProfileCard } from '../../components/shared/WhatsAppProfileCard';
import { useWhatsAppData } from './useWhatsAppData';

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
          <WhatsAppProfileCard
            title={t('settings.whatsapp.profile.title')}
            displayName={whatsAppProfile?.displayName ?? null}
            displayPhoneNumber={whatsAppProfile?.displayPhoneNumber ?? null}
            isLoading={whatsAppProfileLoading}
            editAction={
              <Button variant="tertiary" size="normal" onClick={() => openPlatformUrl('/integrations/apps/my')}>
                {t('settings.whatsapp.profile.edit')}
              </Button>
            }
          />
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
