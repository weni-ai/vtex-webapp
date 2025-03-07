import { Button, Flex, Modal, ModalContent, ModalDismiss, ModalHeader, ModalHeading, Text, ModalFooter, IconCopySimple } from "@vtex/shoreline";
import { getAgent } from "../store/projectSlice";
import { useSelector } from "react-redux";
import { RootState } from "src/interfaces/Store";
export interface AddAbandonedCartProps {
    open: boolean,
    toggleModal: () => void;
    confirm: () => void;
}

export function AddAbandonedCart({ open, toggleModal, confirm }: AddAbandonedCartProps) {
    const channel = useSelector((state: RootState) => getAgent(state).channel);
    return (
        <Modal open={open} onClose={toggleModal} >
            <ModalHeader>
                <Flex>
                    <ModalHeading>
                        {t('agents.categories.active.abandoned_cart.modal.title')}
                    </ModalHeading>
                </Flex>
                <ModalDismiss />
            </ModalHeader>
            <ModalContent>
                <Flex style={{ marginBottom: 'var(--sl-space-5)' }}>
                    <Text variant="body">{t('agents.categories.active.abandoned_cart.modal.steps.faststore.description')}</Text>
                </Flex>
                {channel === 'faststore' && (
                    <Flex direction="column" gap="$space-5">
                        <Flex direction="column" gap="$space-5">
                            <Text variant="body" style={{ paddingLeft: '1.5rem', position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 0 }}>1.</span>
                                {t('agents.categories.active.abandoned_cart.modal.steps.faststore.step1')}
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
                )}
            </ModalContent>
            <ModalFooter>
                <Button onClick={toggleModal}>{t('common.cancel')}</Button>
                <Button variant="primary" onClick={confirm}>{t('common.confirm')}</Button>
            </ModalFooter>
        </Modal >
    )
}