import { Button, Flex, Grid, IconButton, IconCheck, IconCode, IconDotsThreeVertical, IconGearSix, IconInfo, IconPauseCircle, IconPlus, IconXCircle, MenuItem, MenuPopover, MenuProvider, MenuSeparator, MenuTrigger, Skeleton, Text, toast } from "@vtex/shoreline";
import { AboutAgent } from "./AboutAgent";
import { useMemo, useState } from "react";
import { integrateAgent } from "../services/agent.service";
import { useSelector } from "react-redux";
import { agentsLoading, selectProject } from "../store/projectSlice";
import { DisableAgent } from "./DisableAgent";
import { TagType } from "./TagType";
import { SettingsContainer } from "./settings/SettingsContainer/SettingsContainer";
import { AddAbandonedCart } from "./AddAbandonedCart";
import store from "../store/provider.store";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import { useNavigate } from "react-router-dom";
import { ModalAgentPassiveDetails } from "./agent/ModalPassiveDetails";
import { WhatsAppRequiredModal } from "./agent/modals/WhatsAppRequired";
import { RootState } from "../interfaces/Store";

type codes = 'abandoned_cart' | 'order_status';

export function AgentBoxContainer({ children }: { children: React.ReactNode }) {
  return (
    <Grid
      columns="repeat(auto-fill, minmax(21.5rem, 1fr))"
      rows="192px"
      autoRows="var(--sl-grid-rows)"
    >
      {children}
    </Grid>
  )
}

export function AgentBoxSkeleton({ count }: { count: number }) {
  return (
    Array.from({ length: count }).map((_, index) => (
      <Skeleton key={index} />
    ))
  )
}

export function AgentBoxEmpty() {
  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      gap="$space-4"
      style={{
        border: 'var(--sl-border-base)',
        borderRadius: 'var(--sl-radius-2)',
        height: '272px',
        padding: 'var(--sl-space-4)',
      }}
    >
      <IconXCircle width="30px" height="30px" color="var(--sl-color-gray-8)" />

      <Text variant="display3" color="$fg-base">{t('agents.list.empty.title')}</Text>
    </Flex>
  )
}

function DescriptiveStatus({ status }: { status: 'test' | 'configuring' | 'integrated' }) {
  const { color, icon, text } = {
    test: {
      color: '$fg-base-disabled',
      icon: <IconCode />,
      text: t('agents.common.test'),
    },
    configuring: {
      color: '$fg-informational',
      icon: null,
      text: t('agents.common.configuring'),
    },
    integrated: {
      color: '$fg-success',
      icon: <IconCheck />,
      text: t('agents.common.added'),
    },
  }[status];

  return (
    <Text variant="action" color={color}>
      <Flex align="center" gap="$space-2" style={{ padding: 'var(--sl-space-3)' }}>
        {icon}
        {text}
      </Flex>
    </Text>
  );
}

export function AgentBox({ origin, name, description, uuid, code, type, isIntegrated, isInTest, isConfiguring, skills }: { origin: 'commerce' | 'nexus', name: string, description: string, uuid: string, code: codes, type: 'active' | 'passive', isIntegrated: boolean, isInTest: boolean, isConfiguring: boolean, skills: string[] }) {
  const navigate = useNavigate();
  const projectUUID = useSelector(selectProject)
  const [openAbout, setOpenAbout] = useState(false)
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false)
  const [openDisable, setOpenDisable] = useState(false)
  const [openAbandonedCartModal, setOpenAbandonedCartModal] = useState(false)
  const isUpdateAgentLoading = useSelector(agentsLoading).find(loading => loading.agent_uuid === uuid)?.isLoading || false;
  const channel = store.getState().project.storeType;
  const isAgentDetailsPageAccessEnabled = useFeatureIsOn('agentDetailsPageAccess');
  const [isPassiveDetailsModalOpen, setIsPassiveDetailsModalOpen] = useState(false);
  const [isWhatsAppRequiredModalOpen, setIsWhatsAppRequiredModalOpen] = useState(false);
  const isWppIntegrated = useSelector((state: RootState) => state.user.isWhatsAppIntegrated);

  const openDetailsModal = () => {
    setOpenAbout((o) => !o)
  }
  const openDisableModal = () => {
    setOpenDisable((o) => !o)
  }

  const toggleIsPreferencesOpen = () => {
    setIsPreferencesOpen((o) => !o)
  }

  const integrateCurrentFeature = async () => {
    if (origin === 'commerce' && code === 'abandoned_cart' && channel !== 'site_editor') {
      setOpenAbandonedCartModal(true);
      return;
    }
    
    verifyIfWhatsAppIntegrationIsRequired();
  }

  async function verifyIfWhatsAppIntegrationIsRequired() {
    if (isWppIntegrated || type === 'passive') {
      integrateAgentInside();
    } else {
      setIsWhatsAppRequiredModalOpen(true);
    }
  }

  async function integrateAgentInside() {
    const result = await integrateAgent(uuid, projectUUID);
    if (result.error) {
      toast.critical(t('integration.error'));
    } else {
      toast.success(t('integration.success'));
      afterIntegrateAgent();
    }
  }

  function afterIntegrateAgent() {
    if (type === 'passive' && !isWppIntegrated) {
      setIsPassiveDetailsModalOpen(true);
    }
  }

  const status = useMemo(() => {
    if (isInTest) {
      return 'test';
    } else if (isConfiguring) {
      return 'configuring';
    } else if (isIntegrated) {
      return 'integrated';
    } else {
      return 'availableToIntegrate';
    }
  }, [isInTest, isConfiguring, isIntegrated]);

  const agentName =
    t(`agents.categories.${type}.${code}.title`) === `agents.categories.${type}.${code}.title`
      ? name
      : t(`agents.categories.${type}.${code}.title`);

  const agentDescription =
    t(`agents.categories.${type}.${code}.description`) === `agents.categories.${type}.${code}.description`
      ? description
      : t(`agents.categories.${type}.${code}.description`);

  const isNexusAgent = origin === 'nexus';
  const isStatusBetweenIntegrated = ['test', 'configuring', 'integrated'].includes(status);

  const stopPropagation = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  }

  const navigateToAgentDetailsPage = () => {
    navigate(`/agents/${uuid}`);
  }

  const isAgentClickable = useMemo(() => {
    return (isAgentDetailsPageAccessEnabled || (type === 'passive' && !isWppIntegrated)) && isIntegrated;
  }, [isAgentDetailsPageAccessEnabled, isIntegrated, type, isWppIntegrated]);

  const handleAgentClick = () => {
    if (!isAgentClickable) {
      return;
    }

    if (origin === 'nexus' && type === 'passive') {
      setIsPassiveDetailsModalOpen(true);
      return;
    }

    navigateToAgentDetailsPage();
  }

  return (
    <>
      <Flex
        direction="column"
        gap="$space-2"
        style={{
          border: 'var(--sl-border-base)',
          borderRadius: 'var(--sl-radius-2)',
          padding: '16px 16px 24px 16px',
          cursor: isAgentClickable ? 'pointer' : 'default',
        }}
        onClick={handleAgentClick}
      >
        <Flex gap="$space-1" justify="space-between">
          <Flex direction="column" gap="$space-2">
            <Text variant="display3" color="$fg-base">
              {agentName}
            </Text>

            <TagType type={type} />
          </Flex>

          {
            (!isNexusAgent || isStatusBetweenIntegrated) && (
              <MenuProvider>
                <MenuTrigger asChild onClick={stopPropagation}>
                  <IconButton variant="tertiary" label="Actions">
                    <IconDotsThreeVertical />
                  </IconButton>
                </MenuTrigger>

                <MenuPopover onClick={stopPropagation}>
                  {
                    !isNexusAgent && (
                      <MenuItem onClick={openDetailsModal}>
                        <IconInfo />
                        {t('common.details')}
                      </MenuItem>
                    )
                  }

                  {
                    isStatusBetweenIntegrated && (
                      <>
                        {
                          !isNexusAgent && (
                            <>
                              <MenuItem onClick={toggleIsPreferencesOpen}>
                                <IconGearSix />
                                {t('common.manage_settings')}
                              </MenuItem>

                              <MenuSeparator />
                            </>
                          )
                        }

                        <MenuItem onClick={openDisableModal}>
                          <IconPauseCircle />
                          {t('common.disable')}
                        </MenuItem>
                      </>
                    )
                  }
                </MenuPopover>
              </MenuProvider>
            )
          }
        </Flex>

        <Flex style={{ minHeight: '2.5rem', marginTop: 'var(--sl-space-1)' }}>
          <Text
            variant="body"
            color="$fg-base-soft"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {agentDescription}
          </Text>
        </Flex>

        {
          [
            'test',
            'configuring',
            'integrated',
          ].includes(status) ?
            (
              <DescriptiveStatus status={status as 'test' | 'configuring' | 'integrated'} />
            ) : (
              <Button variant="primary" onClick={integrateCurrentFeature} size="large" loading={isUpdateAgentLoading}>
                <IconPlus />
                <Text>{t('agents.common.add')}</Text>
              </Button>
            )
        }
      </Flex>

      <AboutAgent
        open={openAbout}
        code={code}
        category={type}
        toggleModal={openDetailsModal}
      />

      <SettingsContainer
        open={isPreferencesOpen}
        code={code}
        agentUuid={uuid}
        toggleOpen={toggleIsPreferencesOpen}
      />

      <DisableAgent
        open={openDisable}
        toggleModal={openDisableModal}
        agent={agentName}
        agentUuid={uuid}
        agentOrigin={origin}
      />

      <AddAbandonedCart
        open={openAbandonedCartModal}
        toggleModal={() => setOpenAbandonedCartModal((o) => !o)}
        confirm={() => {
          verifyIfWhatsAppIntegrationIsRequired();
          setOpenAbandonedCartModal(false);
        }}
      />

      <ModalAgentPassiveDetails
        open={isPassiveDetailsModalOpen}
        onClose={() => setIsPassiveDetailsModalOpen(false)}
        agentName={agentName}
        agentDescription={agentDescription}
        skills={skills}
      />

      <WhatsAppRequiredModal
        open={isWhatsAppRequiredModalOpen}
        onClose={() => setIsWhatsAppRequiredModalOpen(false)}
        isLoading={isUpdateAgentLoading}
        onConfirm={async () => {
          await integrateAgentInside();
          setIsWhatsAppRequiredModalOpen(false);
        }}
      />
    </>
  );
}