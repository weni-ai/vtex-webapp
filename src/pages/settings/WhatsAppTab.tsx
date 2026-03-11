import { Divider, Flex, Heading, IconPlus, Skeleton, Text, toast } from '@vtex/shoreline';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/adapters/Button';
import { AgentBox, AgentBoxContainer, AgentBoxEmpty, AgentBoxSkeleton } from '../../components/AgentBox';
import { AgentsGalleryModal } from '../../components/agent/modals/Gallery';
import { openPlatformUrl } from '../../utils/platform';
import { integrateAgent } from '../../services/agent.service';
import store from '../../store/provider.store';
import { useWhatsAppData } from './useWhatsAppData';
import WhatsAppIcon from '../../assets/channels/whatsapp.svg';

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
            <img src={WhatsAppIcon} alt="" style={{ width: '28px', height: '28px' }} />
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

  const {
    hasWhatsApp,
    whatsAppProfile,
    whatsAppProfileLoading,
    cliAgents,
    hasFirstLoadHappened,
  } = useWhatsAppData();

  async function handleAssignFromGallery(uuid: string) {
    const projectUuid = store.getState().project.project_uuid;
    try {
      const result = await integrateAgent(uuid, projectUuid);
      if (result.error) {
        toast.critical(t('integration.error'));
      } else {
        toast.success(t('integration.success'));
      }
    } catch {
      toast.critical(t('integration.error'));
    }
  }

  return (
    <Flex direction="column" gap="$space-5" style={{ width: '100%' }}>
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
            {cliAgents.map((agent) => (
              <AgentBox
                key={agent.uuid}
                name={agent.name || ''}
                description={agent.description || ''}
                uuid={agent.uuid}
                code={agent.code}
                type={agent.notificationType}
                isIntegrated={agent.isAssigned}
                origin={agent.origin}
                isInTest={agent.isInTest}
                isConfiguring={agent.isConfiguring || false}
                skills={agent.skills || []}
                onAssign={handleAssignFromGallery}
              />
            ))}
          </AgentBoxContainer>
        )}
      </Flex>

      <AgentsGalleryModal
        open={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        onAssign={handleAssignFromGallery}
        originFilter="CLI"
      />
    </Flex>
  );
}
