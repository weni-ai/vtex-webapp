import { Flex, Text } from "@vtex/shoreline";

export function DashboardItem({ title, value, style }: { title: string, value: string, style?: React.CSSProperties | undefined }) {
  return (
    <Flex
      data-testid="dashboard-item-container"
      direction="column"
      gap="$space-1"
      style={{
        padding: 'var(--sl-space-4)',
        ...style,
      }}
    >
      <Flex align="center" gap="$space-2">
        <Text variant="display4" color="$fg-base-soft">
          {title}
        </Text>
      </Flex>

      <Flex align="center" gap="$space-2">
        <Text variant="display1" color="$fg-base">
          {value}
        </Text>
      </Flex>
    </Flex>
  );
}