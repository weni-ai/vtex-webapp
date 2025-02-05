import { Checkbox, DrawerContent, Field, FieldDescription, Input, Label, Select, SelectItem } from "@vtex/shoreline";
import { ChangeEvent, useState } from "react";

export function PreferencesOrderStatusActive() {
  const [hasTestContactNumber, setHasTestContactNumber] = useState(false);
  const [testContactNumber, setTestContactNumber] = useState('');

  const [hasSelectedSellers, setHasSelectedSellers] = useState(false);
  const [selectedSellers, setSelectedSellers] = useState<string[]>([]);

  function updateSelectedSellers(items: string[]) {
    setSelectedSellers(items);
  }

  function beforeSetTestContactNumber(phoneNumber: string) {
    const eventLocal = event as unknown as { target: { selectionStart: number; selectionEnd: number; } };

    const selectionStart = eventLocal.target.selectionStart;

    const initialPicture = phoneNumber.slice(0, selectionStart || 0) + '|' + phoneNumber.slice(selectionStart || 0);
    let rest = phoneNumber.replace(/[^\d]/g, '');
    let final = '';

    if (rest.slice(0, 2) === '55' || rest.slice(0, 3) === '055') {
      if (rest.slice(0, 2) === '55') {
        final += `+${rest.slice(0, 2)}`;
        rest = rest.slice(2);
      } else if (rest.slice(0, 3) === '055') {
        final += `+${rest.slice(1, 3)}`;
        rest = rest.slice(3);
      }

      if (rest.length) {
        final += ' ';
      }

      final += rest.slice(0, 2);
      rest = rest.slice(2);

      if (rest.length) {
        final += ' ';
      }

      final += rest.slice(0, 5);
      rest = rest.slice(5);

      if (rest.length) {
        final += '-';
      }

      final += rest.slice(0, 4);
      rest = rest.slice(4);
    } else {
      final += rest;
    }
    
    setTestContactNumber(final);

    setTimeout(() => {
      const countNumbers = initialPicture.replace(/[^\d|]/g, '').indexOf('|') + final.split(/\d/).splice(0, initialPicture.replace(/[^\d|]/g, '').indexOf('|')).join('').length;

      eventLocal.target.selectionStart = eventLocal.target.selectionEnd = countNumbers
    }, 0);
  }

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
            onChange={beforeSetTestContactNumber}
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
            setValue={updateSelectedSellers}
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