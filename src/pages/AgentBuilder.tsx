import { Bleed, ContextualHelp, Divider, Field, Flex, Input, Label, Page, PageContent, PageHeader, PageHeaderRow, PageHeading, Text, Textarea } from '@vtex/shoreline';
import iconManageSearch from '../assets/icons/manage_search.svg';
import iconNeurology from '../assets/icons/neurology.svg';
import iconVolunteerActivism from '../assets/icons/volunteer_activism.svg';

export function AgentBuilder() {
  return (
    <Page>
      <PageHeader>
        <PageHeaderRow style={{
          justifyContent: 'start',
          gap: 'var(--sl-space-3)'
        }}>
          <PageHeading>
            Setup your agent
          </PageHeading>
        </PageHeaderRow>
      </PageHeader>

      <Divider />

      <PageContent>
        <Flex style={{
          marginBottom: 'var(--sl-space-5)'
        }}>
          <Text variant="emphasis" color="$fg-base-soft">
            Enhances intelligent agents by enabling them to control conversation flows based on user intentions. It allows customization of language, tone, and behaviors, giving the agent a unique identity and improving communication quality.
          </Text>
        </Flex>

        <Flex
          direction="column"
          gap="$space-2"
          style={{
            marginBlock: 'var(--sl-space-6)',
            border: 'var(--sl-border-base)',
            borderRadius: 'var(--sl-radius-2)',
            padding: 'var(--sl-space-4) var(--sl-space-6)',
          }}
        >
          <Flex style={{
            marginBottom: 'var(--sl-space-2)'
          }}>
            <Text variant="caption1" color="$color-gray-7">Agent Skills</Text>
          </Flex>

          <Flex justify="space-between" gap="$space-6">
            <Flex align="center" gap="$space-2">
              <Bleed top="$space-05" start="$space-05" bottom="$space-05" end="$space-05">
                <img src={iconManageSearch} alt="manage search icon" />
              </Bleed>

              <Text variant="body" color="$color-gray-11">
                Analyze the context
              </Text>
            </Flex>


            <Flex align="center" gap="$space-2">
              <Bleed top="$space-05" start="$space-05" bottom="$space-05" end="$space-05">
                <img src={iconNeurology} alt="neurology icon" />
              </Bleed>

              <Text variant="body" color="$color-gray-11">
                Comprehend complex demands
              </Text>
            </Flex>
            
            <Flex align="center" gap="$space-2">
              <Bleed top="$space-05" start="$space-05" bottom="$space-05" end="$space-05">
                <img src={iconVolunteerActivism} alt="volunteer activism icon" />
              </Bleed>

              <Text variant="body" color="$color-gray-11">
                Provide customized responses
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <form>
          <Flex direction="column">
            <Field>
              <Label>Agent Name</Label>
              <Input />
            </Field>

            <Field>
              <Label>Occupation (optional)</Label>
              <Input />
            </Field>

            <Field>
              <Label>Objective (optional)</Label>
              <Input />
            </Field>

            <Field>
              <Label>Objective (optional)</Label>
              <Textarea />
            </Field>

            <Field>
              <Label>
                <Flex align="center" gap="$space-05">
                  Add knowledge (optional)
                  
                  <ContextualHelp placement="bottom-start" label="Message" style={{
                    display: 'flex'
                  }}>
                    Visits to the store which can include a series of user interactions and
                    end after 30 minutes of inactivity.
                  </ContextualHelp>
                </Flex>
              </Label>
              <Input prefix="https://" />
            </Field>
          </Flex>
        </form>
      </PageContent>
    </Page>
  )
}
