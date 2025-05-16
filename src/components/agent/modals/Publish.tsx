import { Button, Field, FieldDescription, Flex, Input, Label, Modal, ModalContent, ModalDismiss, ModalFooter, ModalHeader, ModalHeading, Text } from "@vtex/shoreline";

export function PublishModal({ open, onClose, onPublish }: { open: boolean, onClose: () => void, onPublish: () => void }) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalHeader>
        <ModalHeading>{t('agent.modals.publish.title')}</ModalHeading>
        <ModalDismiss />
      </ModalHeader>

      <ModalContent>
        <Flex direction="column" gap="$space-4">
          <Text variant="body" color="$fg-base">
            {t('agent.modals.publish.description')}
          </Text>

          <Flex direction="column">
            <Field>
              <Label>{t('agent.modals.publish.fields.percentage.title')}</Label>

              <Input suffix="%" />

              <FieldDescription>
                {t('agent.modals.publish.fields.percentage.description')}
              </FieldDescription>
            </Field>
          </Flex>
        </Flex>
      </ModalContent>

      <ModalFooter>
        <Button size="large" onClick={onClose}>{t('agent.modals.publish.buttons.cancel')}</Button>

        <Button
          size="large"
          variant="primary"
          onClick={() => { onPublish(); onClose(); }}
        >
          {t('agent.modals.publish.buttons.publish')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
