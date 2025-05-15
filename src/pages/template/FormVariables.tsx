import { Button, Field, Flex, IconButton, IconPlus, IconTrash, Input, Label, Text } from "@vtex/shoreline";
import { SetStateAction } from "react";
import { SectionHeader, Variable } from "./Template";

function VariableEmptyState() {
  return (
    <Flex direction="column" gap="$space-1" align="center" style={{ width: '360px', textAlign: 'center', }}>
      <Text variant="display3" color="$fg-base">{t('template.form.areas.variables.empty.title')}</Text>

      <Text variant="body" color="$fg-base-soft">{t('template.form.areas.variables.empty.description')}</Text>
    </Flex>
  )
}

export function VariableItem({ definition, fallbackText, setDefinition, setFallbackText }: {
  definition: string;
  fallbackText: string;
  setDefinition: (value: string) => void;
  setFallbackText: (value: string) => void;
}) {
  return (
    <>
      <Field>
        <Label>{t('template.form.fields.variables.definition.label')}</Label>

        <Input value={definition} onChange={setDefinition} />
      </Field>

      <Field>
        <Label>{t('template.form.fields.variables.fallback_text.label')}</Label>

        <Input value={fallbackText} onChange={setFallbackText} />
      </Field>
    </>
  )
}

export function FormVariables({ variables, setVariables, openAddingVariableModal }: {
  variables: Variable[];
  setVariables: React.Dispatch<SetStateAction<Variable[]>>;
  openAddingVariableModal: () => void;
}) {
  return (
    <Flex direction="column" gap="$space-4">
      {variables.length > 0 && (
        <SectionHeader title={t('template.form.areas.variables.title')} />
      )}

      <Flex direction="column" gap="$space-4" align={variables.length === 0 ? 'center' : undefined}>
        {variables.length === 0 && (
          <VariableEmptyState />
        )}

        {variables.map((variable, index) => (
          <Flex key={index} direction="column" gap="$space-4" style={{ padding: 'var(--sl-space-4)', border: 'var(--sl-border-base)', borderRadius: 'var(--sl-radius-2)', }}>
            <Flex align="center" gap="$space-2" justify="space-between">
              <Text variant="emphasis" color="$fg-base">Variable {`{{${index + 1}}}`}</Text>

              <IconButton variant="tertiary" label="Remove element" onClick={() => setVariables(variables.filter((_, i) => i !== index))}>
                <IconTrash />
              </IconButton>
            </Flex>

            <VariableItem
              definition={variable.definition}
              fallbackText={variable.fallbackText}
              setDefinition={(value) => setVariables(variables.map((v, i) => i === index ? { ...v, definition: value } : v))}
              setFallbackText={(value) => setVariables(variables.map((v, i) => i === index ? { ...v, fallbackText: value } : v))}
            />
          </Flex>
        ))}

        <Button variant="secondary" size="large" onClick={openAddingVariableModal}>
          <Flex gap="$space-1" align="center">
            <IconPlus />
            {t('template.form.areas.variables.buttons.add')}
          </Flex>
        </Button>
      </Flex>
    </Flex>
  )
}
