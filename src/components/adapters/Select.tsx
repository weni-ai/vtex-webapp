import unnnic from "@weni/unnnic-system";
import { applyPureVueInReact } from "veaury";
import { useState } from "react";
import { Select as ShorelineSelect, SelectItem as ShorelineSelectItem } from "@vtex/shoreline";

const UnnnicSelect = applyPureVueInReact(unnnic.unnnicSelectSmart) as React.ComponentType<{
  'data-testid'?: string;
  modelValue: { value: string }[];
  options: { label: string; value: string }[];
  'onUpdate:modelValue': (value: { value: string }[]) => void;
  size?: string;
}>;

export function Select(props: {
  system?: 'shoreline' | 'unnnic',
  value: string,
  setValue: (value: string) => void,
  options: {
    label: string,
    value: string,
  }[],
  size?: 'small' | 'medium' | 'large',
  'data-testid'?: string,
  style?: React.CSSProperties,
}) {
  const dataTestId = props['data-testid'];
  const size = props.size || 'medium';

  function onValue(value: { value: string }[]) {
    props.setValue(value[0].value);
  }

  const sizeMap = {
    small: 'sm' as const,
    medium: 'md' as const,
  };

  if (props.system === 'shoreline') {
    return <ShorelineSelect
      data-testid={dataTestId}
      value={props.value}
      setValue={props.setValue}
      style={props.style}
    >
      {props.options.map(option => (
        <ShorelineSelectItem key={option.value} value={option.value}>{option.label}</ShorelineSelectItem>
      ))}
    </ShorelineSelect>;
  }

  return <UnnnicSelect
    data-testid={dataTestId}
    modelValue={props.options.filter(option => option.value === props.value)}
    options={props.options}
    onUpdate:modelValue={onValue}
    size={sizeMap[size as keyof typeof sizeMap]}
  />;
}

export function SelectExamples() {
  let [value, setValue] = useState('2');

  return (
    <section>
      <h1>Select</h1>
      <Select
        system="unnnic"
        value={value}
        setValue={setValue}
        options={[
          {
            label: 'Option 1',
            value: '1',
          }, {
            label: 'Option 2',
            value: '2',
          }, {
            label: 'Option 3',
            value: '3',
          },
        ]}
      />
    </section>
  );
}
