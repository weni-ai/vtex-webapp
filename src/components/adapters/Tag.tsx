import unnnic from "@weni/unnnic-system";
import { Tag as ShorelineTag } from "@vtex/shoreline";
import { applyPureVueInReact } from "veaury";
import { useSelector } from "react-redux";
import { selectDesignSystem } from "../../store/appSlice";

const UnnnicTag = applyPureVueInReact(unnnic.unnnicTag) as React.ComponentType<{
  scheme?: string;
  variant?: string;
  'data-testid'?: string;
  type?: string;
  text?: string;
}>;

export function Tag(props: {
  system?: 'shoreline' | 'unnnic',
  variant?: 'primary' | 'secondary' | undefined
  color?: 'blue' | 'purple' | 'gray' | 'red' | 'teal' | 'pink' | 'green' | 'cyan' | 'orange' | 'yellow' | undefined,
  style?: React.CSSProperties,
  children: React.ReactNode,
  'data-testid'?: string,
}) {
  const system = props.system || useSelector(selectDesignSystem);
  const variant = props.variant || 'primary';
  const color = props.color || 'gray';
  const children = props.children;
  const dataTestId = props['data-testid'];

  if (system === 'shoreline') {
    return <ShorelineTag
      color={color}
      variant={variant}
      data-testid={dataTestId}
    >
      {children}
    </ShorelineTag>;
  }

  const colorMap = {
    blue: 'weni',
    purple: 'aux-purple',
  }

  const variantMap = {
    primary: 'primary' as const,
    secondary: 'secondary' as const,
  }

  return <UnnnicTag
    scheme={colorMap[color as keyof typeof colorMap]}
    variant={variantMap[variant]}
    data-testid={dataTestId}
    type="next"
    text={children as string}
  />;
}

export function TagExamples() {
  return (
    <section>
      <h1>Tag - variant secondary and color blue</h1>
      <Tag system="shoreline" variant="secondary" color="blue">Tag</Tag>
      <Tag system="unnnic" variant="secondary" color="blue">Tag</Tag>

      <h1>Tag - variant secondary and color purple</h1>
      <Tag system="shoreline" variant="secondary" color="purple">Tag</Tag>
      <Tag system="unnnic" variant="secondary" color="purple">Tag</Tag>
    </section>
  );
}
