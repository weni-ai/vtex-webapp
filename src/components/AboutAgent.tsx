import { Flex, Modal, ModalContent, ModalDismiss, ModalHeader, ModalHeading, Tag, Text } from "@vtex/shoreline";
import balao from '../assets/icons/Balao.png'
export interface AboutAgentProps {
    open: boolean,
    type: string;
    title: string;
    category: string;
    description: string;
    disclaimer: string;
    toggleModal: () => void;
}

export function AboutAgent({ open, title, category, description, disclaimer, toggleModal }: AboutAgentProps) {
    return (
        <Modal open={open} onClose={toggleModal} >
            <ModalHeader>
                <Flex>
                    <ModalHeading>{title}</ModalHeading>
                    <Tag color="blue" variant="secondary">{category}</Tag>
                </Flex>
                <ModalDismiss />
            </ModalHeader>
            <ModalContent>
                <Flex style={{
                    width: '100%', padding: '32px', justifyContent: 'center', backgroundColor: '#d9e7fb', borderRadius: 'var(--radius-2, 8px)',
                    border: '1px solid var(--border-base, #E0E0E0)'
                }}>
                    <img src={balao} alt="" />
                </Flex>
                <Flex direction="column" style={{width: '100%', marginTop: '20px', gap: '4px'}}>
                    <Text variant="emphasis">{description}</Text>
                    <Text variant="body" color="$fg-base-soft">{disclaimer}</Text>
                </Flex>
            </ModalContent>
        </Modal >
    )
}