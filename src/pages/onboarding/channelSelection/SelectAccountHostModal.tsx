import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Field,
  FieldDescription,
  Label,
  Modal,
  ModalContent,
  ModalDismiss,
  ModalFooter,
  ModalHeader,
  ModalHeading,
  Select,
  SelectItem,
} from "@vtex/shoreline";

export interface SelectAccountHostModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedHost: string) => Promise<void>;
  hosts: string[];
}

export function SelectAccountHostModal({ open, onClose, onConfirm, hosts }: SelectAccountHostModalProps) {
  const { t } = useTranslation();
  const [selectedHost, setSelectedHost] = useState("");
  const orderedHosts = [...hosts].sort((a, b) => a.length - b.length);

  function handleSetValue(value: string | string[]) {
    const resolved = Array.isArray(value) ? value[0] ?? "" : value;
    setSelectedHost(resolved);
  }

  async function handleConfirm() {
    if (!selectedHost) return;
    onConfirm(selectedHost);
  }

  function handleClose() {
    setSelectedHost("");
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalHeader>
        <ModalHeading>{t("onboarding.select_account_host.title")}</ModalHeading>
        <ModalDismiss />
      </ModalHeader>

      <ModalContent>
        <Field style={{ width: '100%' }}>
          <Label>{t("onboarding.select_account_host.placeholder")}</Label>
          <Select style={{ width: '100%' }} value={selectedHost} setValue={handleSetValue}>
            {orderedHosts.map((host) => (
              <SelectItem key={host} value={host}>
                {host}
              </SelectItem>
            ))}
          </Select>
          <FieldDescription>
            {t("onboarding.select_account_host.help_text")}
          </FieldDescription>
        </Field>
      </ModalContent>

      <ModalFooter>
        <Button variant="primary" onClick={handleConfirm} disabled={!selectedHost}>
          {t("common.confirm")}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
