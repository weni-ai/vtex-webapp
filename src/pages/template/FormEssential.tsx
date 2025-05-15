import { ContextualHelp, Field, FieldDescription, Flex, Grid, Input, Label, Radio, RadioGroup, useRadioState } from "@vtex/shoreline";
import { useState } from "react";
import { SectionHeader } from "./Template";

export function FormEssential() {
  const [language, setLanguage] = useState<'PT-BR' | 'ES'>('PT-BR');
  const languageState = useRadioState({
    value: language,
    setValue: setLanguage as any,
  });

  return (
    <Flex direction="column" gap="$space-4">
      <SectionHeader title={t('template.form.areas.basic.title')} />

      <Grid columns="1fr 1fr" gap="$space-5">
        <Field>
          <Label>{t('template.form.fields.name.label')}</Label>

          <Input
            name="template-name"
          />
        </Field>

        <RadioGroup label={t('template.form.fields.language.label')} horizontal state={languageState}>
          <Radio value="PT-BR">PT-BR</Radio>
          <Radio value="ES">ES</Radio>
        </RadioGroup>
      </Grid>

      <Field>
        <Label>
          <Flex align="center" gap="$space-05">
            {t('template.form.fields.start_condition.label')}

            <ContextualHelp placement="bottom-start" label="Message">
              {t('template.form.fields.start_condition.help')}
            </ContextualHelp>
          </Flex>
        </Label>

        <Input
          name="start-condition"
        />

        <FieldDescription>{t('template.form.fields.start_condition.description')}</FieldDescription>
      </Field>
    </Flex>
  )
}
