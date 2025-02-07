import { Button, Flex, Modal, ModalContent, ModalDismiss, ModalHeader, ModalHeading, Text } from "@vtex/shoreline";
import { VTEXFetch } from "../utils/VTEXFetch";
import { useSelector } from "react-redux";
import { selectToken } from "../store/authSlice";
import { selectProject } from "../store/projectSlice";
export interface AboutAgentProps {
    open: boolean,
    agentUuid: string,
    agent: string,
    toggleModal: () => void;
}

export function DisableAgent({ open, agent, agentUuid, toggleModal }: Readonly<AboutAgentProps>) {
    const token = useSelector(selectToken);
    const projectUuid = useSelector(selectProject);

    function disable() {
        VTEXFetch<{
            message: string;
        }>(`/_v/disable-feature?token=${token}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "feature_uuid": agentUuid,
                "project_uuid": projectUuid,
            }),
        }).then(({ message }) => {
            console.log('message', message);
        })
        .catch((error) => {
            console.error('VTEXFetch failed:', error);
        });
    }
    
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
                    <Button size="large" style={{ width: '100%' }} variant="critical" onClick={disable}>{t('common.disable')}</Button>
                </Flex>
            </ModalContent>
        </Modal >
    )
}