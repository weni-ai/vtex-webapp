import unnnic from "@weni/unnnic-system";
import {
  Modal as ShorelineModal,
  ModalHeader as ShorelineModalHeader,
  ModalHeading as ShorelineModalHeading,
  ModalDismiss as ShorelineModalDismiss,
  ModalContent as ShorelineModalContent,
} from "@vtex/shoreline";
import { applyPureVueInReact } from "veaury";
import { useSelector } from "react-redux";
import { selectDesignSystem } from "../../store/appSlice";

const UnnnicModal = applyPureVueInReact(unnnic.unnnicModalDialog) as React.ComponentType<{
  children: React.ReactNode,
  title: React.ReactNode,
  showCloseIcon: boolean,
  'onUpdate:modelValue': (value: boolean) => void,
  modelValue: boolean,
  size: 'lg',
  onClose: () => void,
}>;

export function Modal(props: {
  system?: 'shoreline' | 'unnnic',
  open: boolean,
  onClose: () => void,
  size?: 'small' | 'large' | 'medium',
  header?: React.ReactNode,
  children: React.ReactNode,
  'data-testid'?: string,
}) {
  const designSystem = props.system || useSelector(selectDesignSystem);

  if (designSystem === 'shoreline') {
    return <ShorelineModal
      open={props.open}
      onClose={props.onClose}
      size="large"
    >
      <ShorelineModalHeader>
        <ShorelineModalHeading>{props.header}</ShorelineModalHeading>
        <ShorelineModalDismiss />
      </ShorelineModalHeader>

      <ShorelineModalContent>
        {props.children}
      </ShorelineModalContent>
    </ShorelineModal>;
  }

  function onUpdateModelValue(value: boolean) {
    if (!value) {
      props.onClose();
    }
  }

  const sizeMap = {
    large: 'lg' as const,
  };

  return <UnnnicModal
    modelValue={props.open}
    onClose={props.onClose}
    size={sizeMap[props.size as keyof typeof sizeMap] || 'lg'}
    title={props.header}
    showCloseIcon={true}
    onUpdate:modelValue={onUpdateModelValue}
  >
    {props.children}
  </UnnnicModal>;
}

export function ModalExamples() {
  return (
    <section>
    </section>
  );
}
