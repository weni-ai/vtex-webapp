import { DrawerContent, Field, FieldDescription, Input, Label } from "@vtex/shoreline";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { agents } from "../../store/projectSlice";
import { SettingsContext, SettingsFormData } from "./SettingsContainer/SettingsContext";
import { useTranslation } from "react-i18next";
import { Checkbox } from "../adapters/Checkbox";

export function PreferencesOrderStatusActive() {
  const { t } = useTranslation();

  const { formData = {}, setFormData } = useContext(SettingsContext) || {};
  const agentsList = useSelector(agents);
  const orderStatusAgent = agentsList.find(agent => agent.origin === 'commerce' && agent.code === 'order_status');
  const currentNumber = orderStatusAgent?.restrictTestContact?.phoneNumber;
  const [hasTestContactNumber, setHasTestContactNumber] = useState(
    !!currentNumber
  );
  const [testContactNumber, setTestContactNumber] = useState(
    currentNumber || ''
  );

  function beforeSetTestContactNumber(phoneNumber: string) {
    const eventLocal = event as unknown as { target: { selectionStart: number; selectionEnd: number; } };

    const pointerPosition = eventLocal.target.selectionStart || 0;

    const valueWithPointer =
      phoneNumber.slice(0, pointerPosition)
      + '|'
      + phoneNumber.slice(pointerPosition);

    let restValue = phoneNumber.replace(/[^\d]/g, '');
    let finalValue = '';

    const BrazilCountryCode = '55';

    if (restValue.startsWith(BrazilCountryCode)) {
      finalValue += `+${BrazilCountryCode}`;
      restValue = restValue.slice(BrazilCountryCode.length);

      const quantityOfNumbersAndEscapePattern = [' ', 2, ' ', 5, '-', 4];

      quantityOfNumbersAndEscapePattern.forEach((element) => {
        if (!restValue.length) {
          return;
        }

        if (restValue.length && typeof element === 'string') {
          finalValue += element;
        }

        if (typeof element === 'number') {
          finalValue += restValue.slice(0, element);
          restValue = restValue.slice(element);
        }
      });
    } else {
      finalValue += restValue;
    }

    setTestContactNumber(finalValue);

    setTimeout(movePointerToOriginalPosition, 0);

    function movePointerToOriginalPosition() {
      const pointerPositionBefore = valueWithPointer.replace(/[^\d|]/g, '').indexOf('|');

      const nonNumbersCharactersBeforeThePointer =
        finalValue
          .split(/\d/)
          .splice(
            0,
            valueWithPointer.replace(/[^\d|]/g, '').indexOf('|')
          )
          .join('').length;

      const pointerCalculated =
        pointerPositionBefore
        + nonNumbersCharactersBeforeThePointer;

      if (eventLocal?.target?.selectionStart) {
        eventLocal.target.selectionStart = eventLocal.target.selectionEnd = pointerCalculated
      }
    }
  }

  useEffect(() => {
    const updatedFormData: SettingsFormData = {
      ...formData,
      order_status_restriction: {
        is_active: hasTestContactNumber,
        phone_numbers: hasTestContactNumber ? testContactNumber : "",
        sellers: []
      },
    };

    setFormData?.(updatedFormData);
  }, [hasTestContactNumber, testContactNumber]);

  return (
    <DrawerContent>
      <Field style={{ display: 'flex', }}>
        <Checkbox
          checked={hasTestContactNumber}
          onChange={() => setHasTestContactNumber(!hasTestContactNumber)}
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
            data-testid="contact-number-input"
          />
        </Field>
      }
    </DrawerContent>
  );
}
