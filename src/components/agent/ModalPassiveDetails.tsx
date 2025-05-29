import { Divider, Field, FieldDescription, Flex, IconButton, IconCopySimple, Input, Modal, ModalContent, ModalDismiss, ModalHeader, ModalHeading, Skeleton, Text, toast } from "@vtex/shoreline";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { getWhatsAppURLService } from "../../services/agent.service";
import { AgentDescriptiveStatus } from "./DescriptiveStatus";
import store from "../../store/provider.store";

interface ModalAgentPassiveDetailsProps {
  open: boolean;
  onClose: () => void;
  agentName: string;
  agentDescription: string;
  skills: string[];
}

function About({ description, skills }: { description: string, skills: string[] }) {
  return (
    <Flex direction="column" gap="$space-2">
      <Text variant="display3" color="$fg-base">{t('agent.modals.details.sections.about.title')}</Text>
      <Text variant="body" color="$fg-base">{description}</Text>

      {skills.length > 0 && (
        <Flex gap="$space-1">
          {skills.map((skill) => (
            <Flex direction="column" gap="$space-2" style={{ border: 'var(--sl-border-base)', borderRadius: 'var(--sl-radius-1)', padding: 'var(--sl-space-1) var(--sl-space-2)' }}>
              <Text variant="caption2" color="$fg-base-soft">{skill}</Text>
            </Flex>
          ))}
        </Flex>
      )}
    </Flex>
  )
}

function Preview({ url, isLoading }: { url: string, isLoading: boolean }) {
  return (
    <Flex direction="column" gap="$space-4">
      <Flex direction="column" gap="$space-2">
        <Text variant="display3" color="$fg-base">{t('agent.modals.details.sections.preview.title')}</Text>
        <Text variant="body" color="$fg-base">{t('agent.modals.details.sections.preview.description')}</Text>
      </Flex>

      {isLoading ? (
        <Skeleton style={{ width: '100px', height: '100px' }} />
      ) : (
        <QRCode size={100} value={url} />
      )}

      <Field>
        <Flex align="center" gap="$space-4">
          {isLoading ? (
            <Skeleton style={{ width: '100%', height: '44px' }} />
          ) : (
            <Input value={url} />
          )}

          <IconButton size="large" label={t('agent.modals.details.sections.preview.buttons.copy')} onClick={() => { navigator.clipboard.writeText(url) }} disabled={isLoading}>
            <IconCopySimple />
          </IconButton>
        </Flex>

        <FieldDescription>
          {t('agent.modals.details.sections.preview.fields.url.description')}
        </FieldDescription>
      </Field>
    </Flex>
  )
}

export function ModalAgentPassiveDetails({ open, onClose, agentName, agentDescription, skills }: ModalAgentPassiveDetailsProps) {
  const [isLoadingWhatsAppURL, setIsLoadingWhatsAppURL] = useState<boolean>(false);
  const [WhatsAppURL, setWhatsAppURL] = useState<string>('');

  async function getWhatsAppURL() {
    try {
      setIsLoadingWhatsAppURL(true);

      const WhatsAppPhoneNumber = store.getState().user.WhatsAppPhoneNumber;

      if (WhatsAppPhoneNumber) {
        setWhatsAppURL(`https://wa.me/${WhatsAppPhoneNumber}`);
      } else {
        const url = await getWhatsAppURLService();
        setWhatsAppURL(url);
      }
    } catch (error) {
      toast.critical((error as Error).message);
    } finally {
      setIsLoadingWhatsAppURL(false);
    }
  }

  useEffect(() => {
    if (open) {
      getWhatsAppURL();
    }
  }, [open]);

  return (
    <Modal size="large" open={open} onClose={onClose}>
      <ModalHeader>
        <ModalHeading>{agentName}</ModalHeading>
        <ModalDismiss />
      </ModalHeader>

      <ModalContent>
        <Flex direction="column" gap="$space-5">
          <Flex direction="column" gap="$space-4">
            <About description={agentDescription} skills={skills} />
            <AgentDescriptiveStatus status="integrated" showLabel={true} />
          </Flex>

          <Divider />

          <Preview url={WhatsAppURL} isLoading={isLoadingWhatsAppURL} />
        </Flex>
      </ModalContent>
    </Modal>
  )
}
