import { AgentsList } from "../AgentsList";
import { Modal } from "../../adapters/Modal";

export function AgentsGalleryModal({ open, onClose, onAssign }: { open: boolean, onClose: () => void, onAssign: (uuid: string) => void }) {
  function handleAssign(uuid: string) {
    onAssign(uuid);
    onClose();
  }

  return (
    <Modal
      system="unnnic"
      open={open}
      onClose={onClose}
      size="large"
      header={t('agents.modals.gallery.title')}
    >
      <AgentsList onAssign={handleAssign} />
    </Modal>
  )
}
