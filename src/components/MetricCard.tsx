import { ContextualHelp, Flex, Text } from '@vtex/shoreline';

export interface MetricCardProps {
  label: string;
  value: string;
  description?: string;
  tooltipText?: string;
}

export function MetricCard({
  label,
  value,
  description,
  tooltipText,
}: MetricCardProps) {
  return (
    <Flex
      direction="column"
      gap="$space-2"
      style={{ padding: 'var(--sl-space-6)' }}
    >
      <Flex gap="$space-2" align="center">
        <Text
          variant="body"
          color="$fg-base"
          style={{
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </Text>

        {tooltipText && (
          <ContextualHelp placement="bottom-start" label={label}>
            {tooltipText}
          </ContextualHelp>
        )}
      </Flex>

      <Flex direction="column" gap="$space-0">
        <Text variant="display2" color="$fg-base">
          {value}
        </Text>

        {description && (
          <Text variant="caption2" color="$fg-base-soft">
            {description}
          </Text>
        )}
      </Flex>
    </Flex>
  );
}
