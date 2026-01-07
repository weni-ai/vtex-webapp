import unnnic from "@weni/unnnic-system";
import { Flex, Radio as ShorelineRadio } from "@vtex/shoreline";
import { applyPureVueInReact } from "veaury";
import { useSelector } from "react-redux";
import { selectDesignSystem } from "../../store/appSlice";
import { useState } from "react";

const UnnnicRadio = applyPureVueInReact(unnnic.unnnicRadio) as React.ComponentType<{
  modelValue: string | number,
  value: string | number,
  'onUpdate:modelValue': (value: string | number) => void,
  children?: React.ReactNode,
  size?: 'sm' | 'md',
}>;

export function Radio(props: {
  system?: 'shoreline' | 'unnnic',
  'data-testid'?: string,
  children?: React.ReactNode,
  value: string,
  disabled?: boolean,
  checked?: boolean,
  onChange?: () => void,
}) {
  const designSystem = props.system || useSelector(selectDesignSystem);
  const dataTestId = props['data-testid'];

  if (designSystem === 'shoreline') {
    return <ShorelineRadio
      value={props.value}
      data-testid={dataTestId}
      disabled={props.disabled}
      checked={props.checked}
      onChange={props.onChange}
    >
      {props.children}
    </ShorelineRadio>;
  }

  function onUpdateModelValue(_value: string | number) {
    props.onChange?.();
  }

  return (
    <UnnnicRadio
      modelValue={props.checked ? props.value : `no-${props.value}`}
      value={props.value}
      onUpdate:modelValue={onUpdateModelValue}
      size="md"
    >
      {props.children}
    </UnnnicRadio>
  );
}

export function RadioExamples() {
  const [headerType, setHeaderType] = useState<'text' | 'media'>('text');

  return (
    <section>
      <h1>Radio</h1>

      <Flex gap="$space-5">
        <Radio
          value="text"
          checked={headerType === 'text'}
          onChange={() => setHeaderType('text')}
        >
          Text
        </Radio>

        <Radio
          value="media"
          checked={headerType === 'media'}
          onChange={() => setHeaderType('media')}
        >
          Media
        </Radio>
      </Flex>

      <Flex gap="$space-5">
        <Radio
          system="unnnic"
          value="text"
          checked={headerType === 'text'}
          onChange={() => setHeaderType('text')}
        >
          Text
        </Radio>

        <Radio
          system="unnnic"
          value="media"
          checked={headerType === 'media'}
          onChange={() => setHeaderType('media')}
        >
          Media
        </Radio>
      </Flex>
    </section>
  );
}
