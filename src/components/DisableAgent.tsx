import { Button, Flex, Modal, ModalContent, ModalDismiss, ModalHeader, ModalHeading, Text } from "@vtex/shoreline";
export interface AboutAgentProps {
    open: boolean,
    agent: string,
    toggleModal: () => void;
}

export function DisableAgent({ open, agent, toggleModal }: Readonly<AboutAgentProps>) {
    return (
        <Modal open={open} onClose={toggleModal} style={{ width: '368px' }}>
            <ModalHeader>
                <Flex>
                    <ModalHeading>{t('agent_gallery.features.disable.title')}</ModalHeading>
                </Flex>
                <ModalDismiss />
            </ModalHeader>
            <ModalContent>
                <Flex style={{ padding: 'var(--space-2, 8px) 0 var(--space-6, 24px) 0' }}>
                    <Text variant='body'>{t('agent_gallery.features.disable.description', {agent})}</Text>
                </Flex>
                <Flex style={{ width: '100%', justifyContent: 'center' }}>
                    <Button size="large" style={{ width: '100%' }} onClick={toggleModal}>{t('common.cancel')}</Button>
                    <Button size="large" style={{ width: '100%' }} variant="critical">{t('common.disable')}</Button>
                </Flex>
            </ModalContent>
        </Modal >
    )
}