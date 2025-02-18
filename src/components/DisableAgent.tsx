import { Button, Flex, Modal, ModalContent, ModalDismiss, ModalHeader, ModalHeading, Spinner, Text, toast } from "@vtex/shoreline";
// import { useEffect, useState } from "react";
// import { VTEXFetch } from "../utils/VTEXFetch";
import { useSelector } from "react-redux";
import { selectToken } from "../store/authSlice";
import { disableFeatureLoading, selectProject } from "../store/projectSlice";
import { disableFeature } from "../services/features.service";
export interface AboutAgentProps {
    open: boolean,
    agentUuid: string,
    agent: string,
    toggleModal: () => void;
}

export function DisableAgent({ open, agent, agentUuid, toggleModal }: Readonly<AboutAgentProps>) {
    // const [isDisabling, setIsDisabling] = useState(false);
    const isDisabling = useSelector(disableFeatureLoading)
    const token = useSelector(selectToken);
    const projectUuid = useSelector(selectProject);


    async function disable() {
        const disableResponse = await disableFeature(projectUuid, agentUuid, token)

        if(disableResponse?.error){
            toast.critical(t('agents.common.disable.error'));
            return
        }

        toast.success(t('agents.common.disable.success'));
        toggleModal();

        // VTEXFetch<{
        //     message: string;
        // }>(`/_v/disable-feature?token=${token}`, {
        //     method: 'DELETE',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         "feature_uuid": agentUuid,
        //         "project_uuid": projectUuid,
        //     }),
        // }).then(() => {
        //     toast.success(t('agents.common.disable.success'));
        // })
        // .catch(() => {
        //     toast.critical(t('agents.common.disable.error'));
        // }).finally(() => {
        //     setIsDisabling(false);
        //     toggleModal();
        // });
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