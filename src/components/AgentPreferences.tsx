import { DrawerProvider, DrawerPopover, DrawerHeader, DrawerDismiss, DrawerContent, Flex, TimeInput, Divider, Text, Grid, GridCell, DrawerHeading, Checkbox, DrawerFooter, Button } from "@vtex/shoreline"
import './AgentPreferences.style.css'
import { useState } from "react"

export interface AgentPreferencesProps {
    open: boolean,
    toggleOpen: () => void
}

export function AgentPreferences({ open, toggleOpen }: AgentPreferencesProps) {
    const [restriction] = useState('')
    return (
        <DrawerProvider open={open} onClose={toggleOpen}>
            <DrawerPopover>
                <DrawerHeader>
                    <DrawerHeading>Preferences</DrawerHeading>
                    <DrawerDismiss />
                </DrawerHeader>
                <DrawerContent  >
                    <Flex style={{ marginBottom: '1rem' }}>
                        {restriction}
                        <Checkbox value={restriction} />
                        <Flex direction="column" style={{ gap: '0px' }}>
                            <Text variant="body">Message Restriction</Text>
                            <Text variant="caption2" color="$fg-base-soft">Restrict message sends to configured hours.</Text>
                        </Flex>
                    </Flex>
                    <Flex direction="column">
                        <Flex direction="column" >
                            <Text variant="emphasis">Monday until friday</Text>
                            <Grid columns="repeat(2, 1fr)">
                                <GridCell>
                                    <Text variant="body" color="$fg-base-soft">From</Text>
                                    {/* <TimeInput className='custom-time-input' /> */}
                                </GridCell>
                                <GridCell>
                                    <Text variant="body" color="$fg-base-soft">To</Text>
                                    {/* <TimeInput /> */}
                                </GridCell>
                            </Grid>
                        </Flex>
                        <Divider style={{ margin: 'var(--sl-space-4) 0' }} />
                        <Flex direction="column">
                            <Text variant="emphasis">Saturday</Text>
                            <Grid columns="repeat(2, 1fr)">
                                <GridCell>
                                    <Text variant="body" color="$fg-base-soft">From</Text>
                                    {/* <TimeInput /> */}
                                </GridCell>
                                <GridCell>
                                    <Text variant="body" color="$fg-base-soft">To</Text>
                                    {/* <TimeInput /> */}
                                </GridCell>
                            </Grid>
                        </Flex>
                    </Flex>
                </DrawerContent>
                <DrawerFooter style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Button onClick={() => null} size="large" style={{width: '50%'}}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => null} size="large" style={{width: '50%'}}>
                        Save
                    </Button>
                </DrawerFooter>
            </DrawerPopover>
        </DrawerProvider >
    )
}