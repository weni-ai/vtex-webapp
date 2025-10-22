import unnnic from "@weni/unnnic-system";
import { ContextualHelp as ShorelineContextualHelp } from "@vtex/shoreline";
import { applyPureVueInReact } from "veaury";
import { useSelector } from "react-redux";
import { selectDesignSystem } from "../../store/appSlice";
import { IconInfo } from "./Icon";

const UnnnicToolTip = applyPureVueInReact(unnnic.unnnicToolTip) as React.ComponentType<{
  text: string,
  enabled: boolean,
  side: 'bottom' | 'top' | 'left' | 'right',
  children: React.ReactNode,
}>;

export function ContextualHelp(props: {
  system?: 'shoreline' | 'unnnic',
  placement: 'bottom-start',
  children: React.ReactNode,
  label: string,
  'data-testid'?: string,
}) {
  const designSystem = props.system || useSelector(selectDesignSystem);

  if (designSystem === 'shoreline') {
    return (
      <ShorelineContextualHelp
        placement="bottom-start"
        label={props.label}
        data-testid={props['data-testid']}
      >
        {props.children}
      </ShorelineContextualHelp>
    );
  }

  const placementMap = {
    'bottom-start': 'bottom' as const,
  }[props.placement];

  return (
    <UnnnicToolTip
      text={props.children as string}
      enabled={true}
      side={placementMap}
      data-testid={props['data-testid']}
    >
      <IconInfo size="16" system="unnnic" />
    </UnnnicToolTip>
  );
}

export function ContextualHelpExamples() {
  return (
    <section>
      <h1>ContextualHelp - shoreline</h1>
      <ContextualHelp placement="bottom-start" system="shoreline" label="ContextualHelp">ContextualHelp</ContextualHelp>
      <ContextualHelp placement="bottom-start" system="unnnic" label="ContextualHelp">ContextualHelp</ContextualHelp>
    </section>
  );
}
