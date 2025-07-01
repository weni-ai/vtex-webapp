import { ContextualHelp, Field, FieldDescription, Flex, Input, Label } from "@vtex/shoreline";
import { SectionHeader } from "./Template";

export function FormEssential({ startCondition, isDisabled }: { startCondition: string, isDisabled: boolean }) {
  return (
    <Flex direction="column" gap="$space-4">
      <SectionHeader title={t('template.form.areas.basic.title')} />

      <Field>
        <Label>
          <Flex align="center" gap="$space-05">
            {t('template.form.fields.start_condition.label')}

            <ContextualHelp placement="bottom-start" label="Message">
              {t('template.form.fields.start_condition.help')}
            </ContextualHelp>
          </Flex>
        </Label>

        <Input value={startCondition} disabled={isDisabled} />

        <FieldDescription>{t('template.form.fields.start_condition.description')}</FieldDescription>
      </Field>
    </Flex>
  )
}
