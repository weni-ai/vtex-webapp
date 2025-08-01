import { ContextualHelp, Field, FieldDescription, FieldError, Flex, Input, Label } from "@vtex/shoreline";
import { SectionHeader } from "./Template";
import { useTranslation } from "react-i18next";

export function FormEssential({
  name,
  setName,
  nameError,
  startCondition,
  setStartCondition,
  startConditionError,
  isStartConditionEditable,
  isNameEditable,
  dataTestId,
}: {
  name: string,
  setName: (name: string) => void,
  nameError: string,
  startCondition: string,
  setStartCondition: (startCondition: string) => void,
  startConditionError: string,
  isStartConditionEditable: boolean,
  isNameEditable: boolean,
  dataTestId?: string,
}) {
  const { t } = useTranslation();

  return (
    <Flex direction="column" gap="$space-4" data-testid={dataTestId}>
      <SectionHeader title={t('template.form.areas.basic.title')} />

      <Field error={!!nameError}>
        <Label>
          <Flex align="center" gap="$space-05">
            {t('template.form.fields.name.label')}
          </Flex>
        </Label>

        <Input value={name} disabled={!isNameEditable} onChange={(value) => setName(value)} data-testid="name-input" />

        <FieldError>{nameError}</FieldError>
      </Field>

      <Field error={!!startConditionError}>
        <Label>
          <Flex align="center" gap="$space-05">
            {t('template.form.fields.start_condition.label')}

            <ContextualHelp placement="bottom-start" label="Message">
              {t('template.form.fields.start_condition.help')}
            </ContextualHelp>
          </Flex>
        </Label>

        <Input value={startCondition} disabled={!isStartConditionEditable} onChange={(value) => setStartCondition(value)} data-testid="start-condition-input" />

        {startConditionError ?
          <FieldError>{startConditionError}</FieldError>
          :
          <FieldDescription>{t('template.form.fields.start_condition.description')}</FieldDescription>
        }
      </Field>
    </Flex>
  )
}
