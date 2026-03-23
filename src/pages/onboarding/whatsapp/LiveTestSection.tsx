import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Flex,
  Field,
  FieldDescription,
  Heading,
  IconButton,
  IconPlus,
  IconX,
  Input,
  Text,
} from '@vtex/shoreline';

interface PhoneEntry {
  id: string;
  countryCode: string;
  phoneNumber: string;
}

const MAX_PHONE_ENTRIES = 5;
const MIN_PHONE_ENTRIES = 1;

const COUNTRY_CODE_PATTERN = /^[+\d]*$/;
const PHONE_NUMBER_PATTERN = /^[\d\s()-]*$/;

function sanitizeCountryCode(value: string): string | null {
  return COUNTRY_CODE_PATTERN.test(value) ? value : null;
}

function sanitizePhoneNumber(value: string): string | null {
  return PHONE_NUMBER_PATTERN.test(value) ? value : null;
}

function createPhoneEntry(): PhoneEntry {
  return {
    id: crypto.randomUUID(),
    countryCode: '',
    phoneNumber: '',
  };
}

export function LiveTestSection() {
  const { t } = useTranslation();
  const [phoneEntries, setPhoneEntries] = useState<PhoneEntry[]>([createPhoneEntry()]);

  const canAddPhone = phoneEntries.length < MAX_PHONE_ENTRIES;
  const canRemovePhone = phoneEntries.length > MIN_PHONE_ENTRIES;

  const hasValidEntry = phoneEntries.some(
    (entry) => entry.countryCode.trim() !== '' && entry.phoneNumber.trim() !== '',
  );

  const handleCountryCodeChange = useCallback((id: string, value: string) => {
    const sanitized = sanitizeCountryCode(value);
    if (sanitized === null) return;

    setPhoneEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, countryCode: sanitized } : entry)),
    );
  }, []);

  const handlePhoneNumberChange = useCallback((id: string, value: string) => {
    const sanitized = sanitizePhoneNumber(value);
    if (sanitized === null) return;

    setPhoneEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, phoneNumber: sanitized } : entry)),
    );
  }, []);

  const handleAddPhone = useCallback(() => {
    if (!canAddPhone) return;
    setPhoneEntries((prev) => [...prev, createPhoneEntry()]);
  }, [canAddPhone]);

  const handleRemovePhone = useCallback(
    (id: string) => {
      if (!canRemovePhone) return;
      setPhoneEntries((prev) => prev.filter((entry) => entry.id !== id));
    },
    [canRemovePhone],
  );

  return (
    <Flex direction="column" gap="$space-4">
      <Heading variant="display3">
        {t('onboarding.onboard_test.whatsapp.live_test_title')}
      </Heading>

      <Flex direction="column" gap="$space-4">
        <Flex direction="column" gap="$space-2" align="flex-end">
          {phoneEntries.map((entry, index) => (
            <Flex key={entry.id} gap="$space-2" align="flex-start" style={{ width: '100%' }}>
              <Field style={{ width: 100, flexShrink: 0, minWidth: 'unset', maxWidth: 'unset' }}>
                <Input
                  value={entry.countryCode}
                  onChange={(value) => handleCountryCodeChange(entry.id, value)}
                />
                <FieldDescription>
                  {t('onboarding.onboard_test.whatsapp.live_test_country_code_help')}
                </FieldDescription>
              </Field>

              <Field style={{ flex: 1 }}>
                <Input
                  value={entry.phoneNumber}
                  onChange={(value) => handlePhoneNumberChange(entry.id, value)}
                />
                <FieldDescription>
                  {t('onboarding.onboard_test.whatsapp.live_test_phone_help')}
                </FieldDescription>
              </Field>

              {index > 0 && canRemovePhone && (
                <IconButton
                  label="Remove phone"
                  variant="tertiary"
                  onClick={() => handleRemovePhone(entry.id)}
                  style={{ marginTop: 4 }}
                >
                  <IconX />
                </IconButton>
              )}
            </Flex>
          ))}

          <Flex gap="$space-4" align="center" justify="flex-end">
            {canAddPhone && (
              <Button variant="tertiary" onClick={handleAddPhone}>
                <IconPlus />
                {t('onboarding.onboard_test.whatsapp.live_test_add_phone')}
              </Button>
            )}
            <Button variant="secondary" disabled={!hasValidEntry}>
              {t('onboarding.onboard_test.whatsapp.live_test_send')}
            </Button>
          </Flex>
        </Flex>

        <Text variant="caption2" style={{ color: 'var(--sl-color-gray-8)' }}>
          {t('onboarding.onboard_test.whatsapp.live_test_description')}
        </Text>
      </Flex>
    </Flex>
  );
}
