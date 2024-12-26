import { Center, Flex, Grid, GridCell, Modal, ModalContent, ModalDismiss, ModalHeader, ModalHeading, Tag } from "@vtex/shoreline";
import abandonedCart from '../assets/icons/abandoned_cart.svg'
export interface AboutAgentProps {
    open: boolean,
    type: string;
    title: string;
    category: string;
    description: string;
    disclaimer: string;
    teste: () => void;
}

export function AboutAgent({ open, title, category, description, disclaimer, teste }: AboutAgentProps) {
    return (
        <Modal open={open} onClose={teste}>
            <ModalHeader>
                <Flex>
                    <ModalHeading>{title}</ModalHeading>
                    <Tag>{category}</Tag>
                </Flex>
                <ModalDismiss />
            </ModalHeader>
            <ModalContent>
                <Grid columns="2fr 1fr">
                    <GridCell>
                        <div>{description}</div>
                    </GridCell>
                    <GridCell>
                        <Center>
                            <img src={abandonedCart} alt="" />
                        </Center>
                    </GridCell>
                </Grid>
                {disclaimer}
            </ModalContent>
        </Modal>
    )
}