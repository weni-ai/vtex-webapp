import { Alert, Button, Flex, IconArrowUpRight, IconCopySimple, Modal, ModalContent, ModalDismiss, ModalHeader, ModalHeading, Tab, Text, TabList, TabPanel, TabProvider, ModalFooter } from "@vtex/shoreline";
import { useNavigate } from 'react-router-dom';

export interface AddAbandonedCartProps {
    open: boolean,
    toggleModal: () => void;
    confirm: () => void;
}

export function AddAbandonedCart({ open, toggleModal, confirm }: AddAbandonedCartProps) {
    const navigate = useNavigate();
    const navigateToAgent = () => navigate('/agent');

    return (
        <Modal open={open} onClose={toggleModal} >
            <ModalHeader>
                <Flex>
                    <ModalHeading>
                        Add Abandoned Cart
                    </ModalHeading>
                </Flex>
                <ModalDismiss />
            </ModalHeader>
            <ModalContent>
                <Alert
                    variant="warning"
                    style={{
                        width: '100%',
                        gap: 'var(--sl-space-5)'
                    }}
                >
                    <Flex
                        align="center"
                        justify="space-between"
                        style={{
                            width: '100%',
                        }}
                    >
                        <Text variant="emphasis" color="$fg-base">
                            Check the store type in the storefront before following the steps below.
                        </Text>

                        <Button variant="tertiary" style={{ flex: 'none', }} onClick={navigateToAgent}>
                            <Text variant='action'> Go to Storefront</Text>
                            <IconArrowUpRight
                                height="1rem"
                                width="1rem"
                                display="inline"
                                style={{
                                    display: 'inline-block',
                                    verticalAlign: 'middle',
                                    marginLeft: 'var(--sl-space-05)'
                                }}
                            />
                        </Button>
                    </Flex>
                </Alert>
                <TabProvider>
                    <TabList style={{ margin: 'var(--sl-space-5) 0' }} >
                        <Tab>Faststore</Tab>
                        <Tab>Portal/Layout</Tab>
                        <Tab>Site Editor</Tab>
                    </TabList>
                    <TabPanel>
                        <Flex direction="column" gap="$space-5">
                            <Flex direction="column" gap="$space-5">
                                <Text variant="body">The agent will only be functional after following these steps:</Text>
                                <Text variant="body" style={{ paddingLeft: '1.5rem', position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: 0 }}>1.</span>
                                    Go to the GitHub repository and paste the code below into the <strong>thirdpartyscripts.tsx</strong> file.
                                </Text>
                            </Flex>
                            <Flex
                                style={{
                                    position: 'relative',
                                    backgroundColor: 'var(--sl-color-neutral-100)',
                                    padding: 'var(--sl-space-4)',
                                    borderRadius: 'var(--sl-radius-2)',
                                    marginTop: 'var(--sl-space-2)',
                                    border: '1px solid var(--sl-color-gray-5)',
                                    alignItems: 'center',
                                }}
                            >
                                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                                    <code>
                                        {`<script src="https://weni.ai/vtex-app.js"></script>`}
                                    </code>
                                </pre>
                                <Button
                                    variant="tertiary"
                                    style={{
                                        position: 'absolute',
                                        right: 'var(--sl-space-2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        top: '50%',
                                        transform: 'translateY(-50%)'
                                    }}
                                    onClick={() => {
                                        navigator.clipboard.writeText(`script src="https://weni.ai/vtex-app.js"></script>`);
                                    }}
                                >
                                    Copy Code
                                    <IconCopySimple
                                        height="1rem"
                                        width="1rem"
                                        display="inline"
                                        style={{
                                            marginLeft: 'var(--sl-space-05)'
                                        }}
                                    />
                                </Button>
                            </Flex>
                        </Flex>
                    </TabPanel>
                    <TabPanel>
                        <Flex direction="column" gap="$space-5">
                            <Text variant="body">The agent will only be functional after following these steps:</Text>
                            <Flex direction="column" gap="$space-0">
                                <Text variant="body" style={{ paddingLeft: '1.5rem', position: 'relative' }}><span style={{ position: 'absolute', left: 0 }}>1.</span>Navigate to the Storefront Layout.</Text>
                                <Text variant="body" style={{ paddingLeft: '1.5rem', position: 'relative' }}><span style={{ position: 'absolute', left: 0 }}>2.</span>  Open the CMS folder.</Text>
                                <Text variant="body" style={{ paddingLeft: '1.5rem', position: 'relative' }}><span style={{ position: 'absolute', left: 0 }}>3.</span>  Go to HTML Templates {`>`} Subtemplates.</Text>
                                <Text variant="body" style={{ paddingLeft: '1.5rem', position: 'relative' }}><span style={{ position: 'absolute', left: 0 }}>4.</span>  Open commonScripts and paste the script below.</Text>
                            </Flex>
                            <Flex
                                style={{
                                    position: 'relative',
                                    backgroundColor: 'var(--sl-color-neutral-100)',
                                    padding: 'var(--sl-space-4)',
                                    borderRadius: 'var(--sl-radius-2)',
                                    marginTop: 'var(--sl-space-2)',
                                    border: '1px solid var(--sl-color-gray-5)',
                                    alignItems: 'center',
                                }}
                            >
                                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                                    <code>
                                        {`<script src="https://weni.ai/vtex-app.js"></script>`}
                                    </code>
                                </pre>
                                <Button
                                    variant="tertiary"
                                    style={{
                                        position: 'absolute',
                                        right: 'var(--sl-space-2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        top: '50%',
                                        transform: 'translateY(-50%)'
                                    }}
                                    onClick={() => {
                                        navigator.clipboard.writeText(`script src="https://weni.ai/vtex-app.js"></script>`);
                                    }}
                                >
                                    Copy Code
                                    <IconCopySimple
                                        height="1rem"
                                        width="1rem"
                                        display="inline"
                                        style={{
                                            marginLeft: 'var(--sl-space-05)'
                                        }}
                                    />
                                </Button>
                            </Flex>
                        </Flex>
                    </TabPanel>
                    <TabPanel>
                        <Text variant="body">No configuration steps are needed for the 'Site Editor' store type. Once confirmed, the agent is ready to go.</Text>
                    </TabPanel>
                </TabProvider>
            </ModalContent>
            <ModalFooter>
                <Button onClick={toggleModal}>Cancel</Button>
                <Button variant="primary" onClick={confirm}>Confirm</Button>    
            </ModalFooter>
        </Modal >
    )
}