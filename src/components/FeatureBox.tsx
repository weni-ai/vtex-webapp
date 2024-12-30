import { Button, Flex, IconButton, IconCheckCircle, IconDotsThreeVertical, IconGearSix, IconInfo, IconMinus, MenuItem, MenuPopover, MenuProvider, MenuSeparator, MenuTrigger, Text } from "@vtex/shoreline";
import { AboutAgent } from "./AboutAgent";
import { useState } from "react";
import { AgentPreferences } from "./AgentPreferences";

export function FeatureBox({ title, type, isIntegrated, description }: { title: string, type: 'active' | 'passive', description: string, isIntegrated: boolean }) {
  const [openAbout, setOpenAbout] = useState(false)
  const [openPreferences, setPreferences] = useState(false)
  const openModal = () => {
    setOpenAbout((o) => !o)
  }
  const openDrawer = () => {
    setPreferences((o) => !o)
  }
  return (
    <>
      <Flex
        direction="column"
        gap="$space-2"
        style={{
          border: 'var(--sl-border-base)',
          borderRadius: 'var(--sl-radius-1)',
          padding: 'var(--sl-space-4)',
        }}
      >
        <Flex gap="$space-1" justify="space-between">
          <Flex direction="column" gap="$space-1">
            <Text variant="display3" color="$fg-base">{title}</Text>

            <Text variant="caption1" color={{ active: '$color-blue-9', passive: '$color-purple-9' }[type]}>
              {{ active: 'Active notification', passive: 'Passive support' }[type]}
            </Text>
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
            color="$fg-base"
          >
            {description}
          </Text>
        </Flex>


        {
          isIntegrated ?
            <Flex
              justify="center"
              style={{
                padding: 'var(--sl-space-2)'
              }}
            >
              <Text variant="caption1" color="$fg-success">
                <IconCheckCircle
                  display="inline"
                  style={{
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    marginRight: 'var(--sl-space-2)'
                  }}
                />

                Integrated skill
              </Text>
            </Flex>
            :
            <Button variant="secondary">Integrate</Button>
        }
      </Flex>
      <AboutAgent open={openAbout} type={"Active Notification"} title={"Abandoned Cart agent"} category={"Active Notification"} description={"Recover sales by reminding customers of items left in the cart."} disclaimer={"With this agent, you increase your chances of conversion, keeping your customer close and encouraging order completion."} toggleModal={openModal} />
    
    <AgentPreferences open={openPreferences} toggleOpen={openDrawer} />
    </>
  );
}