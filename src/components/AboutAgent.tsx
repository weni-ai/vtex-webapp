import { Center, Container, Flex, Grid, GridCell, Modal, ModalContent, ModalDismiss, ModalHeader, ModalHeading, Tag, Text } from "@vtex/shoreline";
import abandonedCart from '../assets/icons/abandoned_cart.svg'
import lightBulb from '../assets/icons/lightbulb.svg'
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
                    <Tag color="blue">{category}</Tag>
                </Flex>
                <ModalDismiss />
            </ModalHeader>
            <ModalContent>
                <Grid columns="2fr 1fr">
                    <GridCell>
                        <Flex direction="column" style={{ gap: '77px' }}>
                            <Text variant="display4" color="$fg-base-soft">
                                {description}
                            </Text>
                            <Container style={{ display: 'flex', border: 'solid 1px #F2F4F5', padding: '8px', gap: '8px', borderRadius: '8px' }}>
                                <img src={lightBulb} alt="" style={{display: 'flex', alignSelf: 'start', padding: '8px'}}/>
                                <Text variant="emphasis" color="$fg-base-soft">
                                    {disclaimer}
                                </Text>
                            </Container>
                        </Flex>
                    </GridCell>
                    <GridCell>
                        <Center>
                            <img src={abandonedCart} alt="" />
                        </Center>
                    </GridCell>
                </Grid>
            </ModalContent>
        </Modal>
    )
}