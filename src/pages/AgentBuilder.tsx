/* eslint-disable @typescript-eslint/no-unused-vars */
import { Bleed, Button, Container, Content, ContextualHelp, Divider, Field, FieldError, Flex, Input, Label, Page, PageContent, PageHeader, PageHeaderRow, PageHeading, Text, Textarea } from '@vtex/shoreline';
import iconManageSearch from '../assets/icons/manage_search.svg';
import iconNeurology from '../assets/icons/neurology.svg';
import iconVolunteerActivism from '../assets/icons/volunteer_activism.svg';
import AgentDemoGif from '../assets/channels/agentDemoGif';
import { useAgentBuilderSetup } from './setup/useAgentBuilderSetup';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectProject } from '../store/projectSlice';

export function AgentBuilder() {
  const [name, setName] = useState('')
  const [error, setError] = useState(false)
  const [occupation, setOccupation] = useState('')
  const [objective, setObjective] = useState('')
  const [knowledge, setKnowledge] = useState('')

  const { buildAgent } = useAgentBuilderSetup()
  const project = useSelector(selectProject)

  function createAgent() {
    setError(!name)

    if (name && !error) {
      const items = { name, occupation, objective, knowledge }
      const payload = Object.fromEntries(
        Object.entries(items).filter(([_, value]) => value !== "")
      );
      console.log('agente sendo criado, pipipipopopo...', payload, project);
      buildAgent(payload, project)
    }
  }
  return (
    <Container>
      <Content narrow>
        <Page>
          <PageHeader>
            <PageHeaderRow style={{
              justifyContent: 'space-between',
              gap: 'var(--sl-space-3)'
            }}>
              <PageHeading>
                Setup your agent persona
              </PageHeading>
              <Button variant="primary" onClick={createAgent}>Continue</Button>
            </PageHeaderRow>
          </PageHeader>

          <Divider />

          <PageContent  style={{maxWidth: '950px'}}>
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
            <Flex direction='row' style={{
              justifyContent: 'space-between',
              gap: 'var(--sl-space-3)'
            }}>
              <form style={{ width: '70%' }}>
                <Flex direction="column">
                  <Field error={error}>
                    <Label>Agent Name</Label>
                    <Input name="name" value={name} onChange={setName} />
                    <FieldError>You must write something</FieldError>
                  </Field>

                  <Field>
                    <Label>Occupation (optional)</Label>
                    <Input name="occupation" value={occupation} onChange={setOccupation} />
                  </Field>

                  <Field>
                    <Label>Objective (optional)</Label>
                    <Flex>
                      <Textarea name="objective" value={objective} onChange={setObjective} style={{ width: '585px' }} />
                    </Flex>
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
                    <Input prefix="https://" name='knowledge' value={knowledge} onChange={setKnowledge} />
                  </Field>
                </Flex>
              </form>
              <AgentDemoGif />
            </Flex>
          </PageContent>
        </Page>
      </Content>
    </Container>
  )
}
