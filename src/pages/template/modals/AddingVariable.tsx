import { Button, Flex, Modal, ModalContent, ModalDismiss, ModalFooter, ModalHeader, ModalHeading } from "@vtex/shoreline";
import { useEffect, useState } from "react";
import { VariableItem } from "../FormVariables";
import { Variable } from "../Template";

export function AddingVariableModal({ open, onClose, addVariable }: { open: boolean; onClose: () => void; addVariable: (variable: Variable) => void }) {
  const [definition, setDefinition] = useState('');
  const [fallbackText, setFallbackText] = useState('');

  useEffect(() => {
    if (open) {
      setDefinition('');
      setFallbackText('');
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <ModalHeader>
        <ModalHeading>{t('template.modals.add.title')}</ModalHeading>
        <ModalDismiss />
      </ModalHeader>

      <ModalContent>
        <Flex direction="column" gap="$space-4">
          <VariableItem
            definition={definition}
            fallbackText={fallbackText}
            setDefinition={setDefinition}
            setFallbackText={setFallbackText}
          />
        </Flex>
      </ModalContent>

      <ModalFooter>
        <Button size="large" onClick={onClose}>{t('template.modals.add.buttons.cancel')}</Button>

        <Button
          size="large"
          variant="primary"
          onClick={() => { addVariable({ definition, fallbackText }); onClose(); }}
          disabled={definition === '' || fallbackText === ''}
        >
          {t('template.modals.add.buttons.done')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
