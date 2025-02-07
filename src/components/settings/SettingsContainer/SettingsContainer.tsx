 
import { DrawerProvider, DrawerPopover, DrawerHeader, DrawerDismiss, DrawerContent, Flex, TimeInput, Divider, Text, Grid, GridCell, DrawerHeading, Checkbox, DrawerFooter, Button } from "@vtex/shoreline"
import './SettingsContainer.style.css'
import { ChangeEvent, useState } from "react"
import { PreferencesOrderStatusActive } from "../OrderStatusActive";

type codes = 'abandoned_cart' | 'order_status';

export interface SettingsContainerProps {
    open: boolean;
    code: codes;
    toggleOpen: () => void;
}

export function SettingsContainer({ open, toggleOpen, code }: SettingsContainerProps) {
    const [restriction, setRestriction] = useState(false)
    const setRestrictionValue = (event: ChangeEvent<HTMLInputElement>) => {
        setRestriction(Boolean(event.target.value))
    }
    return (
        <DrawerProvider open={open} onClose={toggleOpen}>
            <DrawerPopover>
                <DrawerHeader>
                    <DrawerHeading>{t('common.manage_settings')}</DrawerHeading>
                    <DrawerDismiss />
                </DrawerHeader>

                {code === 'abandoned_cart' && (
                    <DrawerContent>
                        <Flex style={{ marginBottom: '1rem' }}>
                            <Checkbox onChange={setRestrictionValue} aria-label={t('agent_gallery.features.abandoned_cart.preferences.restriction_details')}>
                                <Flex direction="column" style={{ gap: '0px' }}>
                                    <Text variant="body">{t('agent_gallery.features.abandoned_cart.preferences.restriction')}</Text>
                                    <Text variant="caption2" color="$fg-base-soft">{t('agent_gallery.features.abandoned_cart.preferences.restriction_details')}</Text>
                                </Flex>
                            </Checkbox>
                        </Flex>
                        {restriction ? <>
                            <Flex direction="column" style={{paddingTop: '24px'}}>
                                <Flex direction="column" >
                                    <Text variant="emphasis">{t('agent_gallery.features.abandoned_cart.preferences.monday_until_friday')}</Text>
                                    <Grid columns="repeat(2, 1fr)">
                                        <GridCell>
                                            <Text variant="body" color="$fg-base-soft">{t('agent_gallery.features.abandoned_cart.preferences.from')}</Text>
                                            <Flex>
                                                <TimeInput className='custom-time-input' />
                                            </Flex>
                                        </GridCell>
                                        <GridCell>
                                            <Text variant="body" color="$fg-base-soft">{t('agent_gallery.features.abandoned_cart.preferences.to')}</Text>
                                            <TimeInput className='custom-time-input' />
                                        </GridCell>
                                    </Grid>
                                </Flex>
                                <Divider style={{ margin: 'var(--sl-space-4) 0' }} />
                                <Flex direction="column">
                                    <Text variant="emphasis">{t('agent_gallery.features.abandoned_cart.preferences.saturday')}</Text>
                                    <Grid columns="repeat(2, 1fr)">
                                        <GridCell>
                                            <Text variant="body" color="$fg-base-soft">{t('agent_gallery.features.abandoned_cart.preferences.from')}</Text>
                                            <TimeInput className='custom-time-input' />
                                        </GridCell>
                                        <GridCell>
                                            <Text variant="body" color="$fg-base-soft">{t('agent_gallery.features.abandoned_cart.preferences.to')}</Text>
                                            <TimeInput className='custom-time-input' />
                                        </GridCell>
                                    </Grid>
                                </Flex>
                            </Flex>
                        </> : null}
                    </DrawerContent>
                )}

                {
                    code === 'order_status'
                    && <PreferencesOrderStatusActive />
                }

                <DrawerFooter style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={toggleOpen} size="large" style={{ width: '50%' }}>
                        {t('common.cancel')}
                    </Button>
                    <Button variant="primary" onClick={() => null} size="large" style={{ width: '50%' }}>
                        {t('common.save')}
                    </Button>
                </DrawerFooter>
            </DrawerPopover>
        </DrawerProvider >
    )
}