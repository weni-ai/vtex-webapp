import { Field, FieldDescription, Flex, IconButton, IconCopySimple, Input, Label, Skeleton, toast } from "@vtex/shoreline";

export function InputCopyToClipboard({ value, label, description, isLoading = false, successMessage, prefix = '' }: { value: string, label?: string, description: string, isLoading?: boolean, successMessage: string, prefix?: string }) {
  function handleCopy() {
    navigator.clipboard.writeText(value);
    toast.informational(successMessage);
  }
  
  return (
    <Field>
      {label && <Label>{label}</Label>}

      <Flex align="center" gap="$space-4">
        {isLoading ? (
          <Skeleton style={{ width: '100%', height: '44px' }} />
        ) : (
          <Input prefix={prefix} value={value} />
        )}

        <IconButton size="large" label={t('agents.details.settings.buttons.copy')} onClick={handleCopy} disabled={isLoading}>
          <IconCopySimple />
        </IconButton>
      </Flex>

      <FieldDescription>
        {description}
      </FieldDescription>
    </Field>
  )
}
