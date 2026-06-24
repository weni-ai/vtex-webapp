import { useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import {
  Button,
  Flex,
  Modal,
  ModalContent,
  ModalDismiss,
  ModalFooter,
  ModalHeader,
  ModalHeading,
  Tag,
  Text,
} from "@vtex/shoreline";

export type WhatsAppActivationMethod = "sandbox" | "official";

export interface WhatsAppActivationModalProps {
  open: boolean;
  isLoading: boolean;
  onClose: () => void;
  onContinue: (method: WhatsAppActivationMethod) => void;
}

interface OptionCardProps {
  selected: boolean;
  onSelect: () => void;
  title: string;
  description: React.ReactNode;
  tag?: string;
  disabled?: boolean;
}

function OptionCard({ selected, onSelect, title, description, tag, disabled }: OptionCardProps) {
  return (
    <Flex
      onClick={disabled ? undefined : onSelect}
      direction="column"
      gap="$space-2"
      style={{
        border: selected
          ? "1px solid var(--sl-color-blue-8)"
          : "1px solid var(--sl-color-gray-4)",
        borderRadius: "var(--sl-radius-2)",
        padding: "var(--sl-space-5)",
        backgroundColor: selected ? "var(--sl-color-blue-1)" : "var(--sl-color-white)",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.6 : 1,
        width: "100%",
      }}
    >
      <Flex justify="space-between" align="center">
        <Flex gap="$space-2" align="center">
          <RadioIndicator checked={selected} />
          <Text variant="display3">{title}</Text>
        </Flex>
        {tag && <Tag color="blue" variant="primary">{tag}</Tag>}
      </Flex>
      <Text variant="caption2" color="$fg-base-soft">
        {description}
      </Text>
    </Flex>
  );
}

function RadioIndicator({ checked }: { checked: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 20,
        height: 20,
        borderRadius: "50%",
        border: checked
          ? "2px solid var(--sl-color-blue-8)"
          : "2px solid var(--sl-color-gray-6)",
        backgroundColor: "var(--sl-color-white)",
        flexShrink: 0,
      }}
    >
      {checked && (
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: "var(--sl-color-blue-8)",
          }}
        />
      )}
    </span>
  );
}

export function WhatsAppActivationModal({
  open,
  isLoading,
  onClose,
  onContinue,
}: WhatsAppActivationModalProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<WhatsAppActivationMethod>("sandbox");

  function handleClose() {
    if (isLoading) return;
    setSelected("sandbox");
    onClose();
  }

  function handleContinue() {
    onContinue(selected);
  }

  return (
    <Modal open={open} onClose={handleClose} size="large">
      <ModalHeader>
        <ModalHeading>{t("onboarding.whatsapp_activation.title")}</ModalHeading>
        {!isLoading && <ModalDismiss />}
      </ModalHeader>

      <ModalContent>
        <Flex direction="column" gap="$space-3">
          <OptionCard
            selected={selected === "sandbox"}
            onSelect={() => !isLoading && setSelected("sandbox")}
            title={t("onboarding.whatsapp_activation.sandbox.title")}
            tag={t("onboarding.whatsapp_activation.sandbox.tag")}
            description={
              <Trans
                i18nKey="onboarding.whatsapp_activation.sandbox.description"
                components={[<Text as="span" variant="caption1" />]}
              />
            }
            disabled={isLoading}
          />

          <OptionCard
            selected={selected === "official"}
            onSelect={() => !isLoading && setSelected("official")}
            title={t("onboarding.whatsapp_activation.official.title")}
            description={t("onboarding.whatsapp_activation.official.description")}
            disabled={isLoading}
          />
        </Flex>
      </ModalContent>

      <ModalFooter>
        <Button variant="primary" onClick={handleContinue} loading={isLoading} disabled={isLoading}>
          {t("common.continue")}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
