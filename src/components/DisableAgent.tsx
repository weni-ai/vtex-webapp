import { Button, Flex, Modal, ModalContent, ModalDismiss, ModalHeader, ModalHeading, Spinner, Text, toast } from "@vtex/shoreline";
import { useSelector } from "react-redux";
import {  selectProject, disableAgentLoading } from "../store/projectSlice";
import { disableAgent } from "../services/agent.service";
export interface AboutAgentProps {
    open: boolean,
    agentUuid: string,
    agent: string,
    agentOrigin: string,
    toggleModal: () => void;
}

export function DisableAgent({ open, agent, agentUuid, toggleModal, agentOrigin }: Readonly<AboutAgentProps>) {
    const isDisabling = useSelector(disableAgentLoading)
    const projectUuid = useSelector(selectProject);


    async function disable() {
        const disableResponse = await disableAgent(projectUuid, agentUuid, agentOrigin)

        if(disableResponse?.error){
            toast.critical(t('agents.common.disable.error'));
            return
        }

        toast.success(t('agents.common.disable.success'));
        toggleModal();
    }
    
    return (
        <Modal open={open} onClose={toggleModal} style={{ width: '368px' }}>
            <ModalHeader>
                <Flex>
                    <ModalHeading>{t('agents.common.disable.title')}</ModalHeading>
                </Flex>
                <ModalDismiss />
            </ModalHeader>
            <ModalContent>
                <Flex style={{ padding: 'var(--space-2, 8px) 0 var(--space-6, 24px) 0' }}>
                    <Text variant='body'>{t('agents.common.disable.description', {agent})}</Text>
                </Flex>
                <Flex style={{ width: '100%', justifyContent: 'center' }}>
                    <Button size="large" style={{ width: '100%' }} onClick={toggleModal}>{t('common.cancel')}</Button>

                    <Button
                        size="large"
                        style={{ width: '100%' }}
                        variant="critical"
                        onClick={disable}
                        disabled={isDisabling}
                    >
                        {
                            isDisabling ?
                            <Spinner description="loading" /> :
                            t('common.disable')
                        }
                    </Button>
                </Flex>
            </ModalContent>
        </Modal >
    )
}