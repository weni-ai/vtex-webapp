import unnnic from "@weni/unnnic-system";
import { Button as ShorelineButton } from "@vtex/shoreline";
import { applyPureVueInReact } from "veaury";
import { useSelector } from "react-redux";
import { selectDesignSystem } from "../../store/appSlice";

const UnnnicButton = applyPureVueInReact(unnnic.unnnicButton) as React.ComponentType<{
  onClick?: () => void;
  size?: string;
  type?: string;
  children?: React.ReactNode;
}>;

export function Button({
  system,
  onClick,
  size = 'normal',
  variant = 'secondary',
  children,
  loading = false,
  ...props
}: {
  system?: 'shoreline' | 'unnnic',
  onClick?: () => void,
  size?: 'normal' | 'large',
  variant?: 'primary' | 'secondary' | 'tertiary' | 'critical' | 'criticalTertiary' | 'unnnic:attention' | 'unnnic:alternative',
  children: React.ReactNode,
  loading?: boolean,
  'data-testid'?: string,
}) {
  const designSystem = system || useSelector(selectDesignSystem);
  const dataTestId = props['data-testid'];

  if (designSystem === 'shoreline') {
    const variantResolved = {
      'unnnic:attention': 'critical' as const,
      'unnnic:alternative': 'secondary' as const
    }[variant as 'unnnic:attention' | 'unnnic:alternative'] || variant;

    return <ShorelineButton
      onClick={onClick}
      size={size}
      variant={variantResolved as 'primary' | 'secondary' | 'tertiary' | 'critical' | 'criticalTertiary'}
      loading={loading}
      data-testid={dataTestId}
    > 
      {children}
    </ShorelineButton>;
  }

  const sizeMap = {
    normal: 'small' as const,
    large: 'large' as const
  }

  const variantMap = {
    primary: 'primary' as const,
    secondary: 'secondary' as const,
    tertiary: 'tertiary' as const,
    critical: 'warning' as const,
    criticalTertiary: 'warning' as const,
    'unnnic:alternative': 'alternative' as const,
    'unnnic:attention': 'attention' as const,
  }

  return <UnnnicButton
    onClick={onClick}
    size={sizeMap[size]}
    type={variantMap[variant]}
  >
    {children}
  </UnnnicButton>;
}

export function ButtonExamples() {
  return (
    <section>
      <h1>Button - size default</h1>
      <Button system="shoreline">Button</Button>
      <Button system="unnnic">Button</Button>

      <h1>Button - size normal</h1>
      <Button system="shoreline" size="normal">Button</Button>
      <Button system="unnnic" size="normal">Button</Button>

      <h1>Button - size large</h1>
      <Button system="shoreline" size="large">Button</Button>
      <Button system="unnnic" size="large">Button</Button>

      <h1>Button - variant default</h1>
      <Button system="shoreline">Button</Button>
      <Button system="unnnic">Button</Button>

      <h1>Button - variant primary</h1>
      <Button system="shoreline" variant="primary">Button</Button>
      <Button system="unnnic" variant="primary">Button</Button>

      <h1>Button - variant tertiary</h1>
      <Button system="shoreline" variant="tertiary">Button</Button>
      <Button system="unnnic" variant="tertiary">Button</Button>

      <h1>Button - variant critical</h1>
      <Button system="shoreline" variant="critical">Button</Button>
      <Button system="unnnic" variant="critical">Button</Button>

      <h1>Button - variant critical tertiary</h1>
      <Button system="shoreline" variant="criticalTertiary">Button</Button>
      <Button system="unnnic" variant="criticalTertiary">Button</Button>

      <h1>Button - variant unnnic:alternative</h1>
      <Button system="shoreline" variant="unnnic:alternative">Button</Button>
      <Button system="unnnic" variant="unnnic:alternative">Button</Button>

      <h1>Button - variant unnnic:attention</h1>
      <Button system="shoreline" variant="unnnic:attention">Button</Button>
      <Button system="unnnic" variant="unnnic:attention">Button</Button>
    </section>
  );
}
