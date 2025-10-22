import { Flex, Grid, Text } from "@vtex/shoreline";
import { SetStateAction } from "react";
import { Checkbox } from "../../adapters/Checkbox";

export function AssignSelectTemplate({ templates, selectedTemplatesUuids, setSelectedTemplatesUuids }: {
  templates: {
    uuid: string,
    name: string,
    startCondition: string
  }[],
  selectedTemplatesUuids: string[],
  setSelectedTemplatesUuids: React.Dispatch<SetStateAction<string[]>>
}) {
  function handleSelectTemplate(uuid: string) {
    setSelectedTemplatesUuids(
      selectedTemplatesUuids.includes(uuid) ?
        selectedTemplatesUuids.filter((item) => item !== uuid) :
        [...selectedTemplatesUuids, uuid]
    );
  }

  return (
    <Flex direction="column" gap="$space-4">
      <Flex direction="column" gap="$space-2">
        <Text variant="display3">
          {t('agents.modals.assign.select_templates.title')}
        </Text>

        <Text variant="body">
          {t('agents.modals.assign.select_templates.description')}
        </Text>
      </Flex>

      <Grid
        columns="repeat(auto-fill, minmax(320px, 1fr))"
        autoRows="var(--sl-grid-rows)"
        gap="$space-4"
      >
        {templates.map((template) => (
          <Flex
            key={template.uuid}
            gap="$space-2"
            direction="column"
            style={{
              border: 'var(--sl-border-base)',
              borderRadius: 'var(--sl-radius-2)',
              padding: 'var(--sl-space-4)',
            }}
          >
            <Checkbox checked={selectedTemplatesUuids.includes(template.uuid)} onChange={() => handleSelectTemplate(template.uuid)}>
              <Text variant="display3" style={{ display: 'block', marginTop: '-2px' }}>
                {template.name}
              </Text>
            </Checkbox>

            <Text
              variant="body"
              color="$fg-base-soft"
              style={{
                height: '40px',
                marginLeft: '28px',
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {template.startCondition}
            </Text>
          </Flex>
        ))}
      </Grid>
    </Flex>
  )
}
