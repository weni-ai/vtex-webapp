import { Button, Flex, Modal, ModalContent, ModalDismiss, ModalFooter, ModalHeader, ModalHeading, Tag } from "@vtex/shoreline";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../interfaces/Store";
import { AssignAbout } from "./AssignAbout";
import { AssignCredentials } from "./AssignCredentials";
import { AssignSelectTemplate } from "./AssignSelectTemplate";
import { AssignWhatsAppRequired } from "./AssignWhatsAppRequired";
import { AgentPassiveAbout } from "../ModalPassiveDetails";
import { useTranslation } from "react-i18next";

const isWppIntegratedSelector = (state: RootState) => state.user.isWhatsAppIntegrated;

export function AgentAssignModal({
  open,
  onClose,
  agentUuid,
  onViewAgentsGallery,
  onAssign,
  isAssigningAgent,
  changeNextButtonTextOnLastPage = true,
}: {
  open: boolean;
  onClose: () => void;
  agentUuid: string;
  onViewAgentsGallery: () => void;
  onAssign: (data: { uuid: string, type: 'active' | 'passive', templatesUuids: string[], credentials: Record<string, string> }) => void;
  isAssigningAgent: boolean;
  changeNextButtonTextOnLastPage?: boolean;
}) {
  const { t } = useTranslation();

  const agent = useSelector((state: RootState) => state.project.agents.find((agent) => agent.uuid === agentUuid));

  const [selectedTemplatesUuids, setSelectedTemplatesUuids] = useState<string[]>([]);
  const [credentials, setCredentials] = useState<{ name: string, value: string }[]>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const isWppIntegrated = useSelector(isWppIntegratedSelector);

  useEffect(() => {
    if (open && agent?.origin === 'CLI') {
      setCurrentPage(0);

      setSelectedTemplatesUuids(agent.templates.map((template) => template.uuid));

      setCredentials(Object.keys(agent.credentials).map((key) => ({
        name: key,
        value: '',
      })));
    } else if (open && agent?.origin === 'nexus') {
      setCurrentPage(0);
    }
  }, [open]);

  const pages = useMemo(() => {
    const pages = [];

    if (agent?.origin === 'CLI') {
      pages.push('about');
      pages.push('select-templates');

      if (!isWppIntegrated) {
        pages.push('WhatsApp-required');
      }

      if (Object.keys(agent.credentials).length > 0) {
        pages.push('credentials');
      }
    } else if (agent?.origin === 'nexus' && agent.notificationType === 'passive') {
      pages.push('about');
    }

    return pages;
  }, [agent, isWppIntegrated]);

  const isLastPage = useMemo(() => {
    return currentPage === pages.length - 1;
  }, [currentPage, pages]);

  const isNextPageDisabled = useMemo(() => {
    if (agent?.origin !== 'CLI') {
      return false;
    }

    if (pages[currentPage] === 'select-templates') {
      return agent.templates.length > 0 && selectedTemplatesUuids.length === 0;
    }

    if (pages[currentPage] === 'WhatsApp-required') {
      return !isWppIntegrated;
    }

    if (pages[currentPage] === 'credentials') {
      return credentials.some((credential) => credential.value.trim() === '');
    }

    return false;
  }, [currentPage, selectedTemplatesUuids, agent, isWppIntegrated, credentials]);

  function handlePreviousPage() {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else {
      onViewAgentsGallery();
    }
  }

  function handleNextPage() {
    if (isLastPage) {
      onAssign({
        uuid: agentUuid,
        type: agent?.notificationType as 'active' | 'passive',
        templatesUuids: selectedTemplatesUuids,
        credentials: credentials.reduce((acc, credential) => ({
          ...acc,
          [credential.name]: credential.value,
        }), {}),
      });
    } else if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  }

  const titleKey = useMemo(() => {
    return agent?.notificationType === 'active' ? 'automation_title' : 'title';
  }, [agent]);

  return (
    <Modal open={open} onClose={onClose} size="large">
      <ModalHeader>
        <ModalHeading>
          <Flex gap="$space-3" align="center">
            {t(`agents.modals.assign.${titleKey}`, { name: agent?.name })}

            {pages.length !== 1 &&
              <Tag size="normal" variant="secondary" color="gray" data-testid="step-tag">
                {t('agents.modals.assign.steps', { currentPage: currentPage + 1, totalPages: pages.length })}
              </Tag>
            }
          </Flex>
        </ModalHeading>

        <ModalDismiss />
      </ModalHeader>

      <ModalContent>
        {agent?.origin === 'CLI' && (
          <>
            {pages[currentPage] === 'about' && (
              <AssignAbout
                description={agent?.description || ''}
                notificationType={agent?.notificationType as 'active' | 'passive'}
                templates={agent?.templates.map((template) => template.name) || []}
              />
            )}

            {pages[currentPage] === 'select-templates' && (
              <AssignSelectTemplate
                templates={agent?.templates || []}
                selectedTemplatesUuids={selectedTemplatesUuids}
                setSelectedTemplatesUuids={setSelectedTemplatesUuids}
              />
            )}

            {pages[currentPage] === 'WhatsApp-required' && (
              <AssignWhatsAppRequired />
            )}

            {pages[currentPage] === 'credentials' && (
              <AssignCredentials
                credentials={Object.entries(agent.credentials).map(([key, value]) => ({
                  name: key,
                  label: value.label,
                  value: credentials.find((credential) => credential.name === key)?.value || '',
                  placeholder: value.placeholder,
                }))}
                setCredentials={setCredentials}
              />
            )}
          </>
        )}

        {agent?.origin === 'nexus' && (
          <>
            {pages[currentPage] === 'about' && (
              <AgentPassiveAbout
                description={agent.description}
                skills={agent.skills}
                type={agent.notificationType}
              />
            )}
          </>
        )}
      </ModalContent>

      <ModalFooter>
        <Button
          size="large"
          onClick={handlePreviousPage}
          data-testid="back-button"
        >
          {t('agents.modals.assign.buttons.back')}
        </Button>

        <Button
          size="large"
          variant="primary"
          onClick={handleNextPage}
          disabled={isNextPageDisabled}
          loading={isAssigningAgent}
          data-testid="next-button"
        >
          {
            isLastPage && changeNextButtonTextOnLastPage ?
              t('agents.modals.assign.buttons.finish') :
              t('agents.modals.assign.buttons.next')
          }
        </Button>
      </ModalFooter>
    </Modal>
  );
}
