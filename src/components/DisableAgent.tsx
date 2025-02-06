import { Button, Flex, Modal, ModalContent, ModalDismiss, ModalHeader, ModalHeading, Text } from "@vtex/shoreline";
import { VTEXFetch } from "../utils/VTEXFetch";
import { selectProject } from "../store/projectSlice";
import { useSelector } from "react-redux";
export interface AboutAgentProps {
    open: boolean,
    agentUuid: string,
    agent: string,
    toggleModal: () => void;
}

export function DisableAgent({ open, agent, agentUuid, toggleModal }: Readonly<AboutAgentProps>) {
    const projectUuid = useSelector(selectProject);

    function disable() {
        VTEXFetch<{
            data: {
                message: string;
            },
        }>('/_v/disable-feature', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "feature_uuid": agentUuid,
                "project_uuid": projectUuid,
            }),
        }).then(({ data }) => {
            console.log('message', data.message);
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
                    {agentUuid}
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