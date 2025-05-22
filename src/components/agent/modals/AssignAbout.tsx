import { Alert, Flex, Grid, Text } from "@vtex/shoreline";
import { useSelector } from "react-redux";
import { RootState } from "../../../interfaces/Store";
import { TagType } from "../../TagType";

export function AssignAbout({ description, notificationType, templates }: { description: string, notificationType: 'active' | 'passive', templates: string[] }) {
  const isWppIntegrated = useSelector((state: RootState) => state.user.isWhatsAppIntegrated);

  return (
    <Flex direction="column" gap="$space-6">
      <Flex direction="column" gap="$space-2">
        <Text variant="display3">
          {t('agents.modals.assign.about.title')}
        </Text>

        <Text variant="body">
          {description}
        </Text>

        <TagType type={notificationType} />
      </Flex>

      <Flex direction="column" gap="$space-2">
        <Text variant="display3">
          {t('agents.modals.assign.templates_available.title')}
        </Text>

        <Grid
          columns="repeat(auto-fill, minmax(220px, 1fr))"
          autoRows="var(--sl-grid-rows)"
          gap="$space-2"
        >
          {templates.map((template, index) => (
            <Flex
              key={index}
              justify="center"
              style={{
                border: 'var(--sl-border-base)',
                borderRadius: 'var(--sl-radius-2)',
                padding: 'var(--sl-space-4) var(--sl-space-2)',
              }}
            >
              <Text variant="body">
                {template}
              </Text>
            </Flex>
          ))}
        </Grid>
      </Flex>

      {!isWppIntegrated && (
        <Alert variant="warning">
          <Text variant="body">
            {t('agents.modals.assign.alerts.WhatsApp_required')}
          </Text>
        </Alert>
      )}
    </Flex>
  )
}
