import { Button, Flex, IconButton, IconCheck, IconDotsThreeVertical, IconGearSix, IconInfo, IconMinus, IconPlus, MenuItem, MenuPopover, MenuProvider, MenuSeparator, MenuTrigger, Tag, Text } from "@vtex/shoreline";
import { AboutAgent } from "./AboutAgent";
import { useState } from "react";
import { AgentPreferences } from "./AgentPreferences";
import { integrateAvailableFeatures } from "../services/features.service";
import { useSelector } from "react-redux";
import { selectToken } from "../store/authSlice";
import { selectProject } from "../store/projectSlice";

export function FeatureBox({ title, type, isIntegrated, description }: { title: string, type: 'active' | 'passive', description: string, isIntegrated: boolean }) {
  const token = useSelector(selectToken);
  const projectUUID = useSelector(selectProject)
  const [openAbout, setOpenAbout] = useState(false)
  const [openPreferences, setPreferences] = useState(false)
  const openModal = () => {
    setOpenAbout((o) => !o)
  }
  const openDrawer = () => {
    setPreferences((o) => !o)
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
          width: '312px',
          height: '182px',
          border: 'var(--sl-border-base)',
          borderRadius: 'var(--sl-radius-1)',
          padding: '16px 16px 24px 16px',
        }}
      >
        <Flex gap="$space-1" justify="space-between">
          <Flex direction="column" gap="$space-1">
            <Text variant="display3" color="$fg-base">{title}</Text>
            <Tag color='blue' variant='secondary' >
              <Text variant="caption1">
                {{ active: 'Active notification', passive: 'Passive support' }[type]}
              </Text>
            </Tag>

          </Flex>

          <MenuProvider>
            <MenuTrigger asChild>
              <IconButton variant="tertiary" label="Actions">
                <IconDotsThreeVertical />
              </IconButton>
            </MenuTrigger>

            <MenuPopover>
              <MenuItem onClick={openModal}>
                <IconInfo />
                Details
              </MenuItem>
              <MenuItem onClick={openDrawer}>
                <IconGearSix />
                Preferences
              </MenuItem>
              <MenuSeparator />
              <MenuItem>
                <IconMinus />
                Disable
              </MenuItem>
            </MenuPopover>
          </MenuProvider>
        </Flex>

        <Flex style={{ height: '4.125rem' }}>
          <Text
            variant="body"
            color="$fg-base-soft"
          >
            {description}
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
                Agent added
              </Text>
            </Flex>
            :
            <Button variant="secondary" onClick={integrateFeature}>
              <IconPlus />
              <Text> Add agent</Text>
            </Button>
        }
      </Flex>
      <AboutAgent open={openAbout} type={"Active Notification"} title={"Abandoned Cart agent"} category={"Active Notification"} description={"Recover sales by reminding customers of items left in the cart."} disclaimer={"With this agent, you increase your chances of conversion, keeping your customer close and encouraging order completion."} toggleModal={openModal} />

      <AgentPreferences open={openPreferences} toggleOpen={openDrawer} />
    </>
  );
}