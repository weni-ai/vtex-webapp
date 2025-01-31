import { Button, Flex, IconButton, IconCheck, IconDotsThreeVertical, IconInfo, IconPauseCircle, IconPlus, MenuItem, MenuPopover, MenuProvider, MenuSeparator, MenuTrigger, Text } from "@vtex/shoreline";
import { AboutAgent } from "./AboutAgent";
import { useState } from "react";
import { integrateAvailableFeatures } from "../services/features.service";
import { useSelector } from "react-redux";
import { selectToken } from "../store/authSlice";
import { selectProject } from "../store/projectSlice";
import { DisableAgent } from "./DisableAgent";
import { TagType } from "./TagType";

type codes = 'abandoned_cart' | 'order_status';

export function FeatureBox({ code, type, isIntegrated }: { code: codes, type: 'active' | 'passive', isIntegrated: boolean }) {
  const token = useSelector(selectToken);
  const projectUUID = useSelector(selectProject)
  const [openAbout, setOpenAbout] = useState(false)
  const [openDisable, setOpenDisable] = useState(false)
  const openDetailsModal = () => {
    setOpenAbout((o) => !o)
  }
  const openDisableModal = () => {
    console.log('...abrindo')
    setOpenDisable((o) => !o)
  }
  const integrateFeature = async () => {
    await integrateAvailableFeatures(projectUUID, token)
  }
  return (
    <>
      <Flex
        direction="column"
        gap="$space-2"
        style={{
          height: '222px',
          border: 'var(--sl-border-base)',
          borderRadius: 'var(--sl-radius-1)',
          padding: '16px 16px 24px 16px',
        }}
      >
        <Flex gap="$space-1" justify="space-between">
          <Flex direction="column" gap="$space-1">
            <Text variant="display3" color="$fg-base">
              {t(`agents.categories.${type}.${code}.title`)}
            </Text>

            <TagType type={type} />
          </Flex>

          <MenuProvider>
            <MenuTrigger asChild>
              <IconButton variant="tertiary" label="Actions">
                <IconDotsThreeVertical />
              </IconButton>
            </MenuTrigger>

            <MenuPopover>
              <MenuItem onClick={openDetailsModal}>
                <IconInfo />
                {t('common.details')}
              </MenuItem>
              <MenuSeparator />
              <MenuItem onClick={openDisableModal}>
                <IconPauseCircle />
                {t('common.disable')}
              </MenuItem>
            </MenuPopover>
          </MenuProvider>
        </Flex>

        <Flex style={{ height: '4.125rem' }}>
          <Text
            variant="body"
            color="$fg-base-soft"
          >
            {t(`agents.categories.${type}.${code}.description`)}
          </Text>
        </Flex>


        {
          isIntegrated ?
            <Flex
              style={{
                padding: 'var(--sl-space-2)',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <IconCheck color="green" />
              <Text variant="action" color="$fg-success">
                {t('agent_gallery.added')}
              </Text>
            </Flex>
            :
            <Button variant="secondary" onClick={integrateFeature} size="large">
              <IconPlus />
              <Text> {t('agent_gallery.button.add')}</Text>
            </Button>
        }
      </Flex>

      {/*
      <AboutAgent
        open={openAbout}
        type={t('agent_gallery.types.active')}
        title={t('agent_gallery.features.abandoned_cart.title')}
        category={t('agent_gallery.types.active')}
        description={t('agent_gallery.features.abandoned_cart.description')}
        disclaimer={t('agent_gallery.features.abandoned_cart.disclaimer')}
        toggleModal={openDetailsModal}
      /> */}

      <AboutAgent
        open={openAbout}
        code={code}
        title={t('agents.order_status.title')}
        category={type}
        description={t('agents.order_status.details.title')}
        disclaimer={t('agents.order_status.details.description')}
        toggleModal={openDetailsModal}
      />

      <DisableAgent open={openDisable} toggleModal={openDisableModal} agent={t('agent_gallery.features.disable.agents.abandoned_cart')} />
    </>
  );
}