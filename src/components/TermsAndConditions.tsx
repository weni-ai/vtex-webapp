import { Modal, ModalHeader, Flex, ModalHeading, ModalDismiss, ModalContent, ModalFooter, Button, Text } from "@vtex/shoreline";

export interface TermsProps {
    open: boolean,
    approve: () => void,
    dismiss: () => void,
}

export function TermsAndConditions({ open, approve, dismiss }: Readonly<TermsProps>) {

    return (
        <Modal open={open} onClose={dismiss} >
            <ModalHeader>
                <Flex>
                    <ModalHeading>{t("terms.title")}</ModalHeading>
                </Flex>
                <ModalDismiss />
            </ModalHeader>
            <ModalContent>
                <Flex direction="column" >
                    <Text variant="body">{t("terms.description")}</Text>
                    <Flex direction="column" style={{ gap: '2px' }}>
                        <Text variant="emphasis">{t("terms.plan_details.title")}</Text>
                        <Text variant="body" style={{ padding: '0px 12px' }}>{t("terms.plan_details.description")}</Text>
                    </Flex>
                    <Flex direction="column" style={{ gap: '2px' }}>
                        <Text variant="emphasis">{t("terms.product_usage.title")}</Text>
                        <Text variant="body" style={{ padding: '0px 12px' }}>{t("terms.product_usage.description")}</Text>
                    </Flex>
                </Flex>
            </ModalContent>
            <ModalFooter>
                <Button size="large" onClick={dismiss}>{t("common.cancel")}</Button>
                <Button variant="primary" size="large" onClick={approve}>{t("terms.agree")}</Button>
            </ModalFooter>
        </Modal>
    )
}
