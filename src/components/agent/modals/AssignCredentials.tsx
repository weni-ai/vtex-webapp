import { Field, Flex, Input, Label, Text } from "@vtex/shoreline";

export function AssignCredentials({ credentials, setCredentials }: { credentials: { name: string, label: string, placeholder: string, value: string }[], setCredentials: (credentials: { name: string, value: string }[]) => void }) {
  function handleChangeCredential(name: string, value: string) {
    setCredentials(credentials.map((credential) => credential.name === name ? { ...credential, value } : credential));
  }

  return (
    <Flex direction="column" gap="$space-4">
      <Flex direction="column" gap="$space-2">
        <Text variant="display3">
          {t('agents.modals.assign.credentials.title')}
        </Text>

        <Text variant="body">
          {t('agents.modals.assign.credentials.description')}
        </Text>
      </Flex>

      {credentials.map((credential) => (
        <Field key={credential.name}>
          <Label>{credential.label}</Label>
          <Input placeholder={credential.placeholder} value={credential.value} onChange={(value) => handleChangeCredential(credential.name, value)} />
        </Field>
      ))}
    </Flex>
  )
}
