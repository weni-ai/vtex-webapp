import { Modal, ModalContent, ModalDismiss, ModalHeader, ModalHeading } from "@vtex/shoreline";
import { AgentsList } from "../AgentsList";

export function AgentsGalleryModal({ open, onClose, onAssign }: { open: boolean, onClose: () => void, onAssign: (uuid: string) => void }) {
  function handleAssign(uuid: string) {
    onAssign(uuid);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} size="large">
      <ModalHeader>
        <ModalHeading>{t('agents.modals.gallery.title')}</ModalHeading>
        <ModalDismiss />
      </ModalHeader>

      <ModalContent>
        <AgentsList onAssign={handleAssign} />
      </ModalContent>
    </Modal>
  )
}
