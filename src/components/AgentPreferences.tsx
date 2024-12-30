import { DrawerProvider, DrawerPopover, DrawerHeader, DrawerDismiss, DrawerContent, Flex, Checkbox, TimeInput, Divider, Text, Grid, GridCell, DrawerHeading } from "@vtex/shoreline"
import './AgentPreferences.style.css'
import { useState } from "react"

export interface AgentPreferencesProps {
    open: boolean,
    toggleOpen: () => void
}

export function AgentPreferences({ open, toggleOpen }: AgentPreferencesProps) {
    const [restriction, setRestriction] = useState('')
    return (
        <DrawerProvider open={open} onClose={toggleOpen}>
            <DrawerPopover>
                <DrawerHeader>
                    <DrawerHeading>Preferences</DrawerHeading>
                    <DrawerDismiss />
                </DrawerHeader>
                <DrawerContent  >
                    <Flex direction="column">
                        {restriction}
                        <Checkbox value={restriction}>Message time restriction</Checkbox>
                        <p>Restrict message sends to configured hours.</p>
                    </Flex>
                    <Flex direction="column" style={{ marginTop: 'var(--sl-space-4)' }}>
                        <Flex direction="column" >
                            <Text>Monday until friday</Text>
                            <Grid columns="repeat(2, 1fr)">
                                <GridCell>
                                <Text>From</Text>
                                    <TimeInput className='custom-time-input' />
                                </GridCell>
                                <GridCell>
                                <Text>To</Text>
                                    <TimeInput />
                                </GridCell>
                            </Grid>
                        </Flex>
                        <Divider style={{ margin: 'var(--sl-space-4) 0' }} />
                        <Flex direction="column">
                            <Text>Saturday</Text>
                            <Grid columns="repeat(2, 1fr)">
                                <GridCell>
                                    <Text>From</Text>
                                    <TimeInput/>
                                </GridCell>
                                <GridCell>
                                    <Text>To</Text>
                                    <TimeInput />
                                </GridCell>
                            </Grid>
                        </Flex>
                    </Flex>
                </DrawerContent>
            </DrawerPopover>
        </DrawerProvider >
    )
}