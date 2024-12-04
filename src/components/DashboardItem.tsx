import { ContextualHelp, Flex, Text } from "@vtex/shoreline";
import { ArrowDrop } from "./ArrowDrop";

export function DashboardItem({ title, value, percentageDifference, style }: { title: string, value: string, percentageDifference: number, style?: React.CSSProperties | undefined }) {
  const kindOfPercentageDifference = percentageDifference > 0 ? 'positive' : percentageDifference < 0 ? 'negative' : 'neutral';
  
  return (
    <Flex
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

        <ContextualHelp placement="bottom-start" label="Message" style={{
          display: 'flex'
        }}>
          Visits to the store which can include a series of user interactions and
          end after 30 minutes of inactivity.
        </ContextualHelp>
      </Flex>

      <Flex align="center" gap="$space-2">
        <Text variant="display1" color="$fg-base">
          {value}
        </Text>

        <Flex>
          <Text variant="caption2" color={{positive: '$fg-success', negative: '$fg-critical', neutral: '$color-gray-6'}[kindOfPercentageDifference]}>
            {Math.abs(percentageDifference)}%

            {
              kindOfPercentageDifference !== 'neutral' 
              &&
                <ArrowDrop
                  isDown={kindOfPercentageDifference === 'negative'}
                  style={{
                    display: 'inline-block',
                    verticalAlign: 'middle',}}
                  />
            }
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}