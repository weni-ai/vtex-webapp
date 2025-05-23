import { Flex, IconCheck, IconCode, Text } from "@vtex/shoreline";

export function AgentDescriptiveStatus({ status, style, showLabel = false }: { status: 'test' | 'configuring' | 'integrated', style?: React.CSSProperties, showLabel?: boolean }) {
  const { color, icon, text } = {
    test: {
      color: '$fg-base-disabled',
      icon: <IconCode />,
      text: t('agents.common.test'),
    },
    configuring: {
      color: '$fg-informational',
      icon: null,
      text: t('agents.common.configuring'),
    },
    integrated: {
      color: '$fg-success',
      icon: <IconCheck />,
      text: t('agents.common.added'),
    },
  }[status];

  return (
    <Flex align="center" gap="$space-3" style={style}>
      {showLabel && (
        <Text variant="emphasis">
          {t('agent.modals.details.sections.about.status.title')}:
        </Text>
      )}

      <Text variant="action" color={color}>
        <Flex align="center" gap="$space-2">
          {icon}
          {text}
        </Flex>
      </Text>
    </Flex>
  );
}
