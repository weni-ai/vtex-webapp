import { Button, Flex, Grid, IconButton, IconDotsThreeVertical, IconGearSix, IconInfo, IconPauseCircle, IconXCircle, MenuItem, MenuPopover, MenuProvider, MenuSeparator, MenuTrigger, Skeleton, Text } from "@vtex/shoreline";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../interfaces/Store";
import { agentsLoading } from "../store/projectSlice";
import store from "../store/provider.store";
import { AboutAgent } from "./AboutAgent";
import { AddAbandonedCart } from "./AddAbandonedCart";
import { DisableAgent } from "./DisableAgent";
import { TagType } from "./TagType";
import { AgentDescriptiveStatus } from "./agent/DescriptiveStatus";
import { ModalAgentPassiveDetails } from "./agent/ModalPassiveDetails";
import { SettingsContainer } from "./settings/SettingsContainer/SettingsContainer";

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

export function AgentBox({ origin, name, description, uuid, code, type, isIntegrated, isInTest, isConfiguring, skills, onAssign }: { origin: 'commerce' | 'nexus' | 'CLI', name: string, description: string, uuid: string, code: codes, type: 'active' | 'passive', isIntegrated: boolean, isInTest: boolean, isConfiguring: boolean, skills: string[], onAssign: (uuid: string) => void }) {
  const navigate = useNavigate();
  const [openAbout, setOpenAbout] = useState(false)
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false)
  const [openDisable, setOpenDisable] = useState(false)
  const [openAbandonedCartModal, setOpenAbandonedCartModal] = useState(false)
  const isUpdateAgentLoading = useSelector(agentsLoading).find(loading => loading.agent_uuid === uuid)?.isLoading || false;
  const channel = store.getState().project.storeType;
  const [isPassiveDetailsModalOpen, setIsPassiveDetailsModalOpen] = useState(false);
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

    onAssign(uuid);
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

  const isCommerceAgent = origin === 'commerce';
  const isNexusAgent = origin === 'nexus';
  const isStatusBetweenIntegrated = ['test', 'configuring', 'integrated'].includes(status);

  const stopPropagation = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  }

  const navigateToAgentDetailsPage = () => {
    navigate(`/agents/${uuid}`);
  }

  const isAgentClickable = useMemo(() => {
    if (!isIntegrated) {
      return false;
    }

    if (type === 'passive') {
      return !isWppIntegrated;
    }

    return origin === 'CLI';
  }, [isIntegrated, type, isWppIntegrated]);

  const handleAgentClick = () => {
    if (!isAgentClickable) {
      return;
    }

    if (type === 'passive') {
      setIsPassiveDetailsModalOpen(true);
      return;
    }

    const agent = store.getState().project.agents.find((agent) => agent.uuid === uuid);

    if (agent?.origin === 'CLI') {
      navigate(`/agents/${agent.assignedAgentUuid}`);
      return;
    }

    navigateToAgentDetailsPage();
  }

  const options = useMemo(() => {
    const items: (
      'separator' |
      {
        label: string;
        icon: React.ReactNode;
        onClick: () => void;
      }
    )[] = [];

    if (isCommerceAgent) {
      items.push({
        label: t('common.details'),
        icon: <IconInfo />,
        onClick: openDetailsModal,
      });

      if (isStatusBetweenIntegrated) {
        items.push({
          label: t('common.manage_settings'),
          icon: <IconGearSix />,
          onClick: toggleIsPreferencesOpen,
        });
      }
    }

    if (isStatusBetweenIntegrated) {
      if (items.length > 0) {
        items.push('separator');
      }

      items.push({
        label: t('common.disable'),
        icon: <IconPauseCircle />,
        onClick: openDisableModal,
      });
    }

    return items;
  }, [isCommerceAgent, isStatusBetweenIntegrated, isNexusAgent]);

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
            options.length > 0 && (
              <MenuProvider>
                <MenuTrigger asChild onClick={stopPropagation}>
                  <IconButton variant="tertiary" label="Actions">
                    <IconDotsThreeVertical />
                  </IconButton>
                </MenuTrigger>

                <MenuPopover onClick={stopPropagation}>
                  {options.map((option) => {
                    if (option === 'separator') {
                      return <MenuSeparator />;
                    }

                    return (
                      <MenuItem key={option.label} onClick={option.onClick}>
                        {option.icon}
                        {option.label}
                      </MenuItem>
                    );
                  })}
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
          ].includes(status) && !isUpdateAgentLoading ?
            (
              <AgentDescriptiveStatus status={status as 'test' | 'configuring' | 'integrated'} style={{ padding: 'var(--sl-space-3)' }} />
            ) : (
              <Button variant="primary" onClick={integrateCurrentFeature} size="large" loading={isUpdateAgentLoading}>
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
          onAssign(uuid);
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
    </>
  );
}