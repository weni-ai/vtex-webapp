import { Button, Modal, ModalContent, ModalDismiss, ModalFooter, ModalHeader, ModalHeading, Text } from "@vtex/shoreline";

export function SwitchToTestModeModal({ open, onClose, onTest }: { open: boolean, onClose: () => void, onTest: () => void }) {
  return (
    <Modal open={open} onClose={onClose} size="small">
      <ModalHeader>
        <ModalHeading>{t('agent.modals.switch_to_test.title')}</ModalHeading>
        <ModalDismiss />
      </ModalHeader>

      <ModalContent>
        <Text variant="body" color="$fg-base">
          {t('agent.modals.switch_to_test.description')}
        </Text>
      </ModalContent>

      <ModalFooter>
        <Button size="large" onClick={onClose}>{t('agent.modals.switch_to_test.buttons.cancel')}</Button>

        <Button
          size="large"
          variant="critical"
          onClick={() => { onTest(); onClose(); }}
        >
          {t('agent.modals.switch_to_test.buttons.confirm')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
