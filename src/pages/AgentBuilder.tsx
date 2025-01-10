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

function isValidURL(url: string): boolean {
  try {
    const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);

    const hasValidTLD = parsedUrl.hostname.includes('.') &&
      !parsedUrl.hostname.startsWith('.') &&
      !parsedUrl.hostname.endsWith('.');

    return hasValidTLD;
  } catch {
    return false;
  }
}

export function AgentBuilder() {
  const [name, setName] = useState('')
  const [error, setError] = useState({
    name: false,
    knowledge: false
  })
  const [occupation, setOccupation] = useState('')
  const [objective, setObjective] = useState('')
  const [knowledge, setKnowledge] = useState('')

  const { buildAgent } = useAgentBuilderSetup()
  const project = useSelector(selectProject)

  function createAgent() {
    setError({
      name: !name.trim(),
      knowledge: !isValidURL(knowledge.trim())
    })

    if (name && knowledge && !error.name && !error.knowledge) {
      const items = {
        name: name.trim(),
        occupation: occupation.trim(),
        objective: objective.trim(),
        knowledge: knowledge.trim()
      }
      const payload =
        Object.fromEntries(
          Object.entries(items).filter(([_, value]) => value !== "")
        );
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
                {t('agent.setup.title')}
              </PageHeading>
              <Button variant="primary" onClick={createAgent}>{t('common.continue')}</Button>
            </PageHeaderRow>
          </PageHeader>

          <Divider />

          <PageContent style={{ maxWidth: '950px' }}>
            <Flex style={{
              marginBottom: 'var(--sl-space-5)'
            }}>
              <Text variant="emphasis" color="$fg-base-soft">
                {t('agent.setup.description')}
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
                <Text variant="caption1" color="$color-gray-7">{t('agent.skills.title')}</Text>
              </Flex>

              <Flex justify="space-between" gap="$space-6">
                <Flex align="center" gap="$space-2">
                  <Bleed top="$space-05" start="$space-05" bottom="$space-05" end="$space-05">
                    <img src={iconManageSearch} alt="manage search icon" />
                  </Bleed>

                  <Text variant="body" color="$color-gray-11">
                  {t('agent.setup.skills.analyze_the_context')}
                  </Text>
                </Flex>


                <Flex align="center" gap="$space-2">
                  <Bleed top="$space-05" start="$space-05" bottom="$space-05" end="$space-05">
                    <img src={iconNeurology} alt="neurology icon" />
                  </Bleed>

                  <Text variant="body" color="$color-gray-11">
                  {t('agent.setup.skills.comprehend')}
                  </Text>
                </Flex>

                <Flex align="center" gap="$space-2">
                  <Bleed top="$space-05" start="$space-05" bottom="$space-05" end="$space-05">
                    <img src={iconVolunteerActivism} alt="volunteer activism icon" />
                  </Bleed>

                  <Text variant="body" color="$color-gray-11">
                  {t('agent.setup.skills.provide')}
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
                  <Field error={error.name}>
                    <Label>Agent Name</Label>
                    <Input name="name" value={name} onChange={setName} />
                    <FieldError>{t('agent.setup.forms.error.empty_input')}</FieldError>
                  </Field>

                  <Field>
                    <Label>{t('agent.setup.forms.occupation')}</Label>
                    <Input name="occupation" value={occupation} onChange={setOccupation} />
                  </Field>

                  <Field>
                    <Label>{t('agent.setup.forms.objective')}</Label>
                    <Flex>
                      <Textarea name="objective" value={objective} onChange={setObjective} style={{ width: '585px' }} />
                    </Flex>
                  </Field>

                  <Field error={error.knowledge}>
                    <Label>
                      <Flex align="center" gap="$space-05">
                      {t('agent.setup.forms.knowledge.title')}

                        <ContextualHelp placement="bottom-start" label="Message" style={{
                          display: 'flex'
                        }}>
                          {t('agent.setup.forms.knowledge.context')}
                        </ContextualHelp>
                      </Flex>
                    </Label>
                    <Input prefix="https://" name='knowledge' value={knowledge} onChange={setKnowledge} />
                    <FieldError>{t('agent.setup.forms.error.valid_url')}</FieldError>
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
