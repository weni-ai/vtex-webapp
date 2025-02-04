import { Checkbox, DrawerContent, Field, FieldDescription, Input, Label, Select, SelectItem } from "@vtex/shoreline";
import { ChangeEvent, useState } from "react";

export function PreferencesOrderStatusActive() {
  const [hasTestContactNumber, setHasTestContactNumber] = useState(false);
  const [testContactNumber, setTestContactNumber] = useState('');

  const [hasSelectedSellers, setHasSelectedSellers] = useState(false);
  const [selectedSellers, setSelectedSellers] = useState([]);

  return (
    <DrawerContent>
      <Field style={{ display: 'flex', }}>
        <Checkbox
          checked={hasTestContactNumber}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setHasTestContactNumber(e.target.value as unknown as boolean)}
          aria-label={t('agents.categories.active.order_status.settings.is_test_contact_number.title')}
        >
          {t('agents.categories.active.order_status.settings.is_test_contact_number.title')}
        </Checkbox>

        <FieldDescription style={{ marginLeft: 'var(--sl-space-7)' }}>
          {t('agents.categories.active.order_status.settings.is_test_contact_number.description')}
        </FieldDescription>
      </Field>

      {
        hasTestContactNumber &&
        <Field style={{
          display: 'flex',
          marginTop: 'var(--sl-space-6)',
        }}>
          <Label>{t('agents.categories.active.order_status.settings.test_contact_number.label')}</Label>

          <Input
            name="contact-number"
            value={testContactNumber}
            onChange={setTestContactNumber}
          />
        </Field>
      }

      <Field
        style={{
          display: 'flex',
          marginTop: 'var(--sl-space-6)',
        }}
      >
        <Checkbox
          checked={hasSelectedSellers}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setHasSelectedSellers(e.target.value as unknown as boolean)}
          aria-label={t('agents.categories.active.order_status.settings.is_selected_sellers.title')}
        >
          {t('agents.categories.active.order_status.settings.is_selected_sellers.title')}
        </Checkbox>

        <FieldDescription style={{ marginLeft: 'var(--sl-space-7)' }}>
          {t('agents.categories.active.order_status.settings.is_selected_sellers.description')}
        </FieldDescription>
      </Field>

      {
        hasSelectedSellers &&
        <Field
          style={{
            display: 'flex',
            marginTop: 'var(--sl-space-6)',
          }}
        >
          <Label>{t('agents.categories.active.order_status.settings.selected_sellers.label')}</Label>

          <Select
            value={selectedSellers}
            setValue={setSelectedSellers}
            messages={
              {
                placeholder: t('agents.categories.active.order_status.settings.selected_sellers.placeholder')
              }
            }
            style={{ width: '100%' }}
          >
            <SelectItem value="option 1">option 1</SelectItem>
            <SelectItem value="option 2">option 2</SelectItem>
            <SelectItem value="option 3">option 3</SelectItem>
            <SelectItem value="option 4">option 4</SelectItem>
            <SelectItem value="option 5">option 5</SelectItem>
          </Select>
        </Field>
      }
    </DrawerContent>
  );
}