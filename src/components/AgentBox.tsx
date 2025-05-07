import { Button, Flex, Grid, IconButton, IconCheck, IconDotsThreeVertical, IconGearSix, IconInfo, IconPauseCircle, IconPlus, MenuItem, MenuPopover, MenuProvider, MenuSeparator, MenuTrigger, Skeleton, Text, toast } from "@vtex/shoreline";
import { AboutAgent } from "./AboutAgent";
import { useMemo, useState } from "react";
import { integrateAgent } from "../services/agent.service";
import { useSelector } from "react-redux";
import { agentsLoading, selectProject} from "../store/projectSlice";
import { DisableAgent } from "./DisableAgent";
import { TagType } from "./TagType";
import { SettingsContainer } from "./settings/SettingsContainer/SettingsContainer";
import wrench from '../assets/icons/Wrench.svg'
import { AddAbandonedCart } from "./AddAbandonedCart";
import store from "../store/provider.store";

type codes = 'abandoned_cart' | 'order_status';

export function AgentBoxContainer({ children }: { children: React.ReactNode }) {
  return (
    <Grid
      columns="repeat(auto-fill, minmax(21.5rem, 1fr))"
      rows="222px"
      autoRows="var(--sl-grid-rows)"
    >
      { children }
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

export function AgentBox({ origin, name, description, uuid, code, type, isIntegrated, isInTest, isConfiguring }: { origin: 'commerce' | 'nexus', name: string, description: string, uuid: string, code: codes, type: 'active' | 'passive', isIntegrated: boolean, isInTest: boolean, isConfiguring: boolean }) {
  const projectUUID = useSelector(selectProject)
  const [openAbout, setOpenAbout] = useState(false)
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false)
  const [openDisable, setOpenDisable] = useState(false)
  const [openAbandonedCartModal, setOpenAbandonedCartModal] = useState(false)
  const isUpdateAgentLoading = useSelector(agentsLoading).find(loading => loading.agent_uuid === uuid)?.isLoading || false;
  const channel = store.getState().project.storeType
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
      setOpenAbandonedCartModal(true)
      return;
    }
    const result = await integrateAgent(uuid, projectUUID);
    if (result.error) {
      toast.critical(t('integration.error'));
    } else {
      toast.success(t('integration.success'));
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
      : t(`agents.categories.${type}.${code}.title`)
  const isNexusAgent = origin === 'nexus';
  const isStatusBetweenIntegrated = ['test', 'configuring', 'integrated'].includes(status);
  
  return (
    <>
      <Flex
        direction="column"
        gap="$space-2"
        style={{
          border: 'var(--sl-border-base)',
          borderRadius: 'var(--sl-radius-1)',
          padding: '16px 16px 24px 16px',
        }}
      >
        <Flex gap="$space-1" justify="space-between">
          <Flex direction="column" gap="$space-1">
            <Text variant="display3" color="$fg-base">
              { agentName }
            </Text>

            <TagType type={type} />
          </Flex>

          {
            (!isNexusAgent || isStatusBetweenIntegrated) && (
              <MenuProvider>
                <MenuTrigger asChild>
                  <IconButton variant="tertiary" label="Actions">
                    <IconDotsThreeVertical />
                  </IconButton>
                </MenuTrigger>

                <MenuPopover>
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

        <Flex style={{ height: '4.125rem' }}>
          <Text
            variant="body"
            color="$fg-base-soft"
          >
            {
              t(`agents.categories.${type}.${code}.description`) === `agents.categories.${type}.${code}.description`
              ? description
              : t(`agents.categories.${type}.${code}.description`)
            }
          </Text>
        </Flex>

        {(() => {
          switch (status) {
            case 'test':
              return (
                <Flex
                  style={{
                    padding: 'var(--sl-space-2)',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <img src={wrench} alt="" />
                  <Text variant="action" color="$fg-warning"> {t('agents.common.test')}</Text>
                </Flex>
              );
            case 'configuring':
              return (
                <Flex
                  style={{
                    padding: 'var(--sl-space-2)',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Text variant="action" color="$fg-informational"> {t('agents.common.configuring')}</Text>
                </Flex>
              );
            case 'integrated':
              return (
                <Flex
                  style={{
                    padding: 'var(--sl-space-2)',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <IconCheck color="green" />
                  <Text variant="action" color="$fg-success">
                    {t('agents.common.added')}
                  </Text>
                </Flex>
              );
            case 'availableToIntegrate':
              return (
                <Button variant="secondary" onClick={integrateCurrentFeature} size="large" loading={isUpdateAgentLoading}>
                  <IconPlus />
                  <Text>{t('agents.common.add')}</Text>
                </Button>
              );
          }
        })()}
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
          integrateAgent(uuid, projectUUID);
          setOpenAbandonedCartModal(false);
        }}
      />
    </>
  );
}