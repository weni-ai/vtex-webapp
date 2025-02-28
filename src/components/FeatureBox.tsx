/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex, IconButton, IconCheck, IconDotsThreeVertical, IconGearSix, IconInfo, IconPauseCircle, IconPlus, MenuItem, MenuPopover, MenuProvider, MenuSeparator, MenuTrigger, Spinner, Text, toast } from "@vtex/shoreline";
import { AboutAgent } from "./AboutAgent";
import { useState } from "react";
import { integrateFeature } from "../services/features.service";
import { useSelector } from "react-redux";
import { featureList, selectProject, updateFeatureLoading } from "../store/projectSlice";
import { DisableAgent } from "./DisableAgent";
import { TagType } from "./TagType";
import { SettingsContainer } from "./settings/SettingsContainer/SettingsContainer";
import wrench from '../assets/icons/Wrench.svg'
import { AddAbandonedCart } from "./AddAbandonedCart";

type codes = 'abandoned_cart' | 'order_status';

export function FeatureBox({ uuid, code, type, isIntegrated, isInTest }: { uuid: string, code: codes, type: 'active' | 'passive', isIntegrated: boolean, isInTest: boolean }) {
  const projectUUID = useSelector(selectProject)
  const [openAbout, setOpenAbout] = useState(false)
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false)
  const [openDisable, setOpenDisable] = useState(false)
  const [openAbandonedCartModal, setOpenAbandonedCartModal] = useState(false)
  const features = useSelector(featureList)
  const isUpdateFeatureLoading = useSelector((state: any) => updateFeatureLoading(state, uuid));
  const featureUuid = features.find((item: { code: string }) => item.code === code)?.uuid || '';
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
    if (code === 'abandoned_cart') {
      setOpenAbandonedCartModal(true)
      return;
    }
    const result = await integrateFeature(featureUuid, projectUUID);
    if (result.error) {
      toast.critical(t('integration.error'));
    } else {
      toast.success(t('integration.success'));
    }
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

              <MenuItem onClick={toggleIsPreferencesOpen}>
                <IconGearSix />
                {t('common.manage_settings')}
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


        {(() => {
          if (isIntegrated) {
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
          }

          if (isInTest) {
            return (
              <Button variant="secondary" onClick={integrateCurrentFeature} size="large" disabled={true}>
                <img src={wrench} alt="" />
                <Text color="$fg-warning"> {t('agents.common.test')}</Text>
              </Button>
            );
          }

          return (
            <Button variant="secondary" onClick={integrateCurrentFeature} size="large">
              {
                isUpdateFeatureLoading ?
                  <Spinner description="loading" />
                  :
                  <>
                    <IconPlus />
                    <Text> {t('agents.common.add')}</Text>
                  </>
              }
            </Button>
          );
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
        agent={t(`agents.categories.${type}.${code}.title`)}
        agentUuid={uuid}
      />

      <AddAbandonedCart
        open={openAbandonedCartModal}
        toggleModal={() => setOpenAbandonedCartModal((o) => !o)}
        confirm={() => {
          integrateFeature(featureUuid, projectUUID);
          setOpenAbandonedCartModal(false);
        }}
      />
    </>
  );
}