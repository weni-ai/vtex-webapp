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
                    <ModalHeading>
                        Terms and conditions
                    </ModalHeading>
                </Flex>
                <ModalDismiss />
            </ModalHeader>
            <ModalContent>
                <Flex direction="column" >
                    <Text variant="body">By using this application, acceptance of the Terms and Conditions is required. These terms define access to and use of the services, detailing the selected plan's features, limitations, pricing, and renewal policies. Additionally, they outline product functionality, usage guidelines, and any applicable restrictions to ensure a secure and optimal experience.</Text>
                    <Flex direction="column" style={{gap: '2px'}}>
                        <Text variant="emphasis">1. Plan Details</Text>
                        <Text variant="body" style={{padding: '0px 12px'}}>Your selected plan includes specific features, limitations, and billing terms. Please check your subscription details to understand what is included and how renewals work.</Text>
                    </Flex>
                    <Flex direction="column" style={{gap: '2px'}}>
                        <Text variant="emphasis">2. Product Usage</Text>
                        <Text variant="body" style={{padding: '0px 12px'}}>This application is designed to enhance your experience through specific features and functionalities. Any misuse, unauthorized access, or violation of the terms may result in account suspension.
                        </Text>
                    </Flex>
                </Flex>
            </ModalContent>
            <ModalFooter>
                <Button size="large" onClick={dismiss}>Cancel</Button>
                <Button variant="primary" size="large" onClick={approve}>Agree</Button>
            </ModalFooter>
        </Modal >
    )
}