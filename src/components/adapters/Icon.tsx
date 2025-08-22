import unnnic from "@weni/unnnic-system";
import {
  IconTrash as ShorelineIconTrash,
  IconGearSix as ShorelineIconGearSix,
  IconInfo as ShorelineIconInfo,
  IconDotsThreeVertical as ShorelineIconDotsThreeVertical,
} from "@vtex/shoreline";
import { applyPureVueInReact } from "veaury";
import { useSelector } from "react-redux";
import { selectDesignSystem } from "../../store/appSlice";

const UnnnicIcon = applyPureVueInReact(unnnic.unnnicIcon) as React.ComponentType<{
  icon: string;
  size?: string;
  style?: React.CSSProperties;
}>;

function mount(icon: 'Trash' | 'GearSix' | 'Info' | 'DotsThreeVertical') {
  const components = {
    Trash: ShorelineIconTrash,
    GearSix: ShorelineIconGearSix,
    Info: ShorelineIconInfo,
    DotsThreeVertical: ShorelineIconDotsThreeVertical,
  };

  const iconNameMap = {
    Trash: 'delete',
    GearSix: 'settings',
    Info: 'info',
    DotsThreeVertical: 'more_vert',
  };

  const component = components[icon] as unknown as {
    render: () => React.ReactNode;
  };
  const iconName = iconNameMap[icon];

  return function Icon(props: {
    system?: 'shoreline' | 'unnnic',
    size?: '16' | '20' | '24' | '32' | '40',
  }) {
    const system = props.system || useSelector(selectDesignSystem);

    if (system === 'shoreline') {
      return component.render();
    }

    const sizeMap = {
      '16': 'sm' as const,
      '20': 'ant' as const,
      '24': 'md' as const,
      '32': 'lg' as const,
      '40': 'xl' as const,
    };

    return (
      <UnnnicIcon
        icon={iconName}
        size={sizeMap[props.size as keyof typeof sizeMap]}
        style={{
          verticalAlign: 'bottom',
        }}
      />
    );
  }
}

export const IconTrash = mount('Trash');
export const IconGearSix = mount('GearSix');
export const IconInfo = mount('Info');
export const IconDotsThreeVertical = mount('DotsThreeVertical');

export function IconExamples() {
  return (
    <section>
      <h1>Icon - trash 16</h1>
      <IconTrash system="shoreline" size="16" />
      <IconTrash system="unnnic" size="16" />

      <h1>Icon - trash 20</h1>
      <IconTrash system="shoreline" size="20" />
      <IconTrash system="unnnic" size="20" />

      <h1>Icon - trash 24</h1>
      <IconTrash system="shoreline" size="24" />
      <IconTrash system="unnnic" size="24" />

      <h1>Icon - trash 32</h1>
      <IconTrash system="shoreline" size="32" />
      <IconTrash system="unnnic" size="32" />

      <h1>Icon - trash 40</h1>
      <IconTrash system="shoreline" size="40" />
      <IconTrash system="unnnic" size="40" />
    </section>
  );
}
