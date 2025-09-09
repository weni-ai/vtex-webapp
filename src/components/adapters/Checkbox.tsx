import unnnic from "@weni/unnnic-system";
import { Checkbox as ShorelineCheckbox } from "@vtex/shoreline";
import { applyPureVueInReact } from "veaury";
import { useSelector } from "react-redux";
import { selectDesignSystem } from "../../store/appSlice";

const UnnnicCheckbox = applyPureVueInReact(unnnic.unnnicCheckbox) as React.ComponentType<{
  modelValue: boolean,
  'onUpdate:modelValue'?: () => void,
  size: 'sm' | 'md',
}>;

export function Checkbox(props: {
  system?: 'shoreline' | 'unnnic',
  checked: boolean,
  onChange?: () => void,
  children: React.ReactNode,
  'aria-label'?: string,
  'data-testid'?: string,
}) {
  const designSystem = props.system || useSelector(selectDesignSystem);

  if (designSystem === 'shoreline') {
    return <ShorelineCheckbox
      checked={props.checked}
      onChange={props.onChange}
      aria-label={props['aria-label']}
      data-testid={props['data-testid']}
    >
      {props.children}
    </ShorelineCheckbox>;
  }

  return (
    <section style={{ display: 'flex', alignItems: 'center', gap: 'var(--sl-space-2)' }}>
      <UnnnicCheckbox
        modelValue={props.checked}
        onUpdate:modelValue={props.onChange}
        data-testid={props['data-testid']}
        size="md"
      >
      </UnnnicCheckbox>


      {props.children}
    </section>
  );
}

export function CheckboxExamples() {
  return (
    <section>
      <h1>Button - checked false</h1>
      <Checkbox checked={false} system="shoreline">Checkbox</Checkbox>
      <Checkbox checked={false} system="unnnic">Checkbox</Checkbox>

      <h1>Button - checked true</h1>
      <Checkbox checked={true} system="shoreline">Checkbox</Checkbox>
      <Checkbox checked={true} system="unnnic">Checkbox</Checkbox>
    </section>
  );
}
