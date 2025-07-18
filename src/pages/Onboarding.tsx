import { Bleed, Button, Flex, IconArrowLeft, IconButton, Page, PageContent, PageHeader, PageHeaderRow, PageHeading, Stack, Tag, toast } from "@vtex/shoreline";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AgentsList } from "../components/agent/AgentsList";
import { AgentAssignModal } from "../components/agent/modals/Assign";
import { WhatsAppRequiredModal } from "../components/agent/modals/WhatsAppRequired";
import { RootState } from "../interfaces/Store";
import { assignAgentCLI, integrateAgent } from '../services/agent.service';
import { agents, getAgentBuilder, setAgents } from '../store/projectSlice';
import store from "../store/provider.store";
import { selectAccount } from '../store/userSlice';
import { AgentBuilder, FormState } from './agent/AgentBuilder';
import { useAgentBuilderSetup } from "./setup/useAgentBuilderSetup";
import { useUserSetup } from "./setup/useUserSetup";

export function Onboarding() {
  const [agentUuid, setAgentUuid] = useState('');
  const isWppIntegrated = useSelector((state: RootState) => state.user.isWhatsAppIntegrated);
  const agentsList = useSelector(agents)
  const agentBuilder = useSelector(getAgentBuilder);
  const account = useSelector(selectAccount);
  const [form, setForm] = useState<FormState>({
    name: agentBuilder.name || account?.accountName || '',
    knowledge: agentBuilder.links[0] || '',
    occupation: agentBuilder.occupation || t('agent.setup.forms.occupation.default'),
    objective: agentBuilder.objective || t('agent.setup.forms.objective.default'),
  });
  const [errors, setErrors] = useState<{ [key in keyof FormState]?: string }>({});
  const projectUuid = useSelector((state: RootState) => state.project.project_uuid);

  const [isAgentAssignModalOpen, setIsAgentAssignModalOpen] = useState(false);
  const [isWhatsAppRequiredModalOpen, setIsWhatsAppRequiredModalOpen] = useState(false);
  const [isAssigningAgent, setIsAssigningAgent] = useState(false);

  const [changeNextButtonTextOnLastPage, setChangeNextButtonTextOnLastPage] = useState(true);

  const { buildAgent } = useAgentBuilderSetup();
  const { initializeUser } = useUserSetup();

  const initialize = async () => {
    await initializeUser();

    const shouldUpdateAgentBuilder = agentBuilder.name !== form.name;

    if (shouldUpdateAgentBuilder) {
      const payload = Object.fromEntries(
        Object.entries(form).filter(([, value]) => value.trim())
      ) as FormState;

      buildAgent(payload, false, '');
    }
  };

  useEffect(() => {
    initialize();
  }, [initializeUser]);

  const pages = ['selectAgent', 'buildManager'] as const;
  const [page, setPage] = useState<typeof pages[number]>('selectAgent');

  const isFirstPage = page === pages[0];
  const isLastPage = page === pages[pages.length - 1];

  function handlePreviousPage() {
    const currentIndex = pages.indexOf(page);
    const previousIndex = currentIndex - 1;

    setPage(pages[previousIndex]);
  }

  async function handleNextPage() {
    if (isLastPage) {
      await handleSubmit();
      return;
    }

    const currentIndex = pages.indexOf(page);
    const nextIndex = currentIndex + 1;

    setPage(pages[nextIndex]);
  }

  const isValidURL = (url: string) => {
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}([/?#].*)?$/i;
    return urlPattern.test(url);
  };

  const validateForm = () => {
    const newErrors: { [key in keyof FormState]?: string } = {
      name: !form.name.trim() ? t('agent.setup.forms.error.empty_input') : '',
      knowledge: !form.knowledge.trim()
        ? t('agent.setup.forms.error.empty_input')
        : !isValidURL(form.knowledge.trim())
          ? t('agent.setup.forms.error.valid_url')
          : '',
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const payload = Object.fromEntries(
        Object.entries(form).filter(([, value]) => value.trim())
      ) as FormState;

      await buildAgent(payload, true, t('agent.actions.assign.success'));
    }
  };

  async function handleAssign(uuid: string) {
    const agent = agentsList.find((item) => item.uuid === uuid);

    if (!agent) {
      return;
    }

    if (agent.origin === 'CLI') {
      setAgentUuid(uuid);
      setIsAgentAssignModalOpen(true);
      setChangeNextButtonTextOnLastPage(true);
    } else if (agent.origin === 'nexus') {
      setAgentUuid(uuid);
      setIsAgentAssignModalOpen(true);
      setChangeNextButtonTextOnLastPage(false);
    }

    if (agent.origin === 'commerce' && agent.notificationType === 'active') {
      if (isWppIntegrated) {
        integrateAgentInside(uuid);
      } else {
        setAgentUuid(uuid);
        setIsWhatsAppRequiredModalOpen(true);
      }
    }
  }

  async function assignPassiveAgent(data: { uuid: string, }) {
    await integrateAgentInside(data.uuid);
  }

  async function handleAssignCLI(data: { uuid: string, type: 'active' | 'passive', templatesUuids: string[], credentials: Record<string, string> }) {
    if (data.type === 'passive') {      
      setIsAssigningAgent(true);

      await assignPassiveAgent({
        uuid: data.uuid,
      });
      
      setIsAgentAssignModalOpen(false);
      setIsAssigningAgent(false);

      return;
    }

    try {
      setIsAssigningAgent(true);

      await assignAgentCLI({
        uuid: data.uuid,
        templatesUuids: data.templatesUuids,
        credentials: data.credentials,
      });

      setIsAgentAssignModalOpen(false);
      handleNextPage();
    } catch (error) {
      toast.critical(error instanceof Error ? error.message : t('common.errors.unexpected_error'));
    } finally {
      setIsAssigningAgent(false);
    }
  }



  async function integrateAgentInside(uuid: string) {
    store.dispatch(setAgents(agentsList.map((item) => ({
      ...item,
      isAssigned: item.uuid === uuid || item.isAssigned,
      isConfiguring: (item.origin === 'commerce' && item.uuid === uuid) || !!item.isConfiguring,
    }))));

    const result = await integrateAgent(uuid, projectUuid);

    if (result.error) {
      toast.critical(t('integration.error'));
    } else {
      handleNextPage();
    }
  }

  return (
    <Page>
      <PageHeader>
        <PageHeaderRow>
          <Flex align="center">
            {!isFirstPage && (<Bleed top="$space-2" bottom="$space-2">
              <IconButton
                label={t('common.return')}
                asChild
                variant="tertiary"
                size="large"
                onClick={handlePreviousPage}
              >
                <IconArrowLeft />
              </IconButton>
            </Bleed>)}

            {page === 'selectAgent' && (<PageHeading>{t('onboarding.select_agent.title')}</PageHeading>)}
            {page === 'buildManager' && (<PageHeading>{t('onboarding.build_manager.title')}</PageHeading>)}

            <Tag size="normal" variant="secondary" color="gray">
              {t('agents.modals.assign.steps', { currentPage: pages.indexOf(page) + 1, totalPages: pages.length })}
            </Tag>
          </Flex>

          <Stack space="$space-3" horizontal>
            <Bleed top="$space-2" bottom="$space-2">
              <Button variant="primary" size="large" onClick={handleNextPage}>
                {isLastPage ? t('common.finish') : t('common.skip')}
              </Button>
            </Bleed>
          </Stack>
        </PageHeaderRow>
      </PageHeader>

      <PageContent>
        {page === 'selectAgent' && (<AgentsList onAssign={handleAssign} />)}
        {page === 'buildManager' && (<AgentBuilder form={form} setForm={setForm} errors={errors} />)}

        <AgentAssignModal
          open={isAgentAssignModalOpen}
          agentUuid={agentUuid}
          onClose={() => setIsAgentAssignModalOpen(false)}
          onViewAgentsGallery={() => {
            setIsAgentAssignModalOpen(false);
          }}
          onAssign={handleAssignCLI}
          isAssigningAgent={isAssigningAgent}
          changeNextButtonTextOnLastPage={changeNextButtonTextOnLastPage}
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
      </PageContent>
    </Page>
  );
}
