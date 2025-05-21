import { Button, Flex, Modal, ModalContent, ModalDismiss, ModalFooter, ModalHeader, ModalHeading } from "@vtex/shoreline";
import { useSelector } from "react-redux";
import { RootState } from "../../../interfaces/Store";
import { Channel } from "../../../pages/Channel";

export interface WhatsAppRequiredProps {
  open: boolean,
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function WhatsAppRequiredModal({ open, onClose, onConfirm, isLoading }: WhatsAppRequiredProps) {
  const isWppIntegrated = useSelector((state: RootState) => state.user.isWhatsAppIntegrated);

  return (
    <Modal open={open} onClose={onClose} >
      <ModalHeader>
        <Flex>
          <ModalHeading>
            {t('agent.modals.integrate_whatsapp.title')}
          </ModalHeading>
        </Flex>
        <ModalDismiss />
      </ModalHeader>

      <ModalContent>
        <Channel isIntegrated={isWppIntegrated} showSkipDisclaimer={false} />
      </ModalContent>

      <ModalFooter>
        <Button onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button variant="primary" onClick={onConfirm} disabled={!isWppIntegrated} loading={isLoading}>
          {t('common.finish')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
