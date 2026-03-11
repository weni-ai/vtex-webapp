import { AgentsList } from "../AgentsList";
import { Modal } from "../../adapters/Modal";

interface AgentsGalleryModalProps {
  open: boolean;
  onClose: () => void;
  onAssign: (uuid: string) => void;
  originFilter?: 'nexus' | 'commerce' | 'CLI';
}

export function AgentsGalleryModal({ open, onClose, onAssign, originFilter }: AgentsGalleryModalProps) {
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
      <AgentsList onAssign={handleAssign} originFilter={originFilter} />
    </Modal>
  )
}
