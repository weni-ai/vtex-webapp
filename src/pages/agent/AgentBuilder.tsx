/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Container, Field, FieldError, Flex, IconArrowLeft, IconButton, Input, Label, navigate, Page, PageContent, PageHeader, PageHeaderRow, PageHeading, Text, Textarea, Tooltip } from '@vtex/shoreline';
import { useAgentBuilderSetup } from '../setup/useAgentBuilderSetup';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectProject } from '../../store/projectSlice';
import question from '../../assets/icons/question.svg'
import { Channel } from '../Channel';
import { isWhatsAppIntegrated } from '../../store/userSlice';

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
  const [name, setName] = useState('');
  const [error, setError] = useState({
    name: false,
    knowledge: false,
  });
  const [errorMessage, setErrorMessage] = useState({
    name: '',
    knowledge: '',
  });
  const [occupation, setOccupation] = useState('');
  const [objective, setObjective] = useState('');
  const [knowledge, setKnowledge] = useState('');

  const { buildAgent } = useAgentBuilderSetup();
  const project = useSelector(selectProject);
  const isIntegrated = useSelector(isWhatsAppIntegrated)

  const navigateBack = () => {
    navigate('/agent-details');
  };

  function createAgent() {
    const isNameEmpty = !name.trim();
    const isKnowledgeEmpty = !knowledge.trim();
    const isKnowledgeInvalid = !isValidURL(knowledge.trim()) && !isKnowledgeEmpty;

    setError({
      name: isNameEmpty,
      knowledge: isKnowledgeEmpty || isKnowledgeInvalid,
    });

    let nameErrorMessage = '';
    if (isNameEmpty) {
      nameErrorMessage = 'Fill this information';
    }

    let knowledgeErrorMessage = '';
    if (isKnowledgeEmpty) {
      knowledgeErrorMessage = 'Fill this information';
    } else if (isKnowledgeInvalid) {
      knowledgeErrorMessage = 'Enter a valid URL';
    }

    setErrorMessage({
      name: nameErrorMessage,
      knowledge: knowledgeErrorMessage,
    });

    if (!isNameEmpty && !isKnowledgeEmpty && !isKnowledgeInvalid) {
      const items = {
        name: name.trim(),
        occupation: occupation.trim(),
        objective: objective.trim(),
        knowledge: knowledge.trim(),
      };
      const payload = Object.fromEntries(
        Object.entries(items).filter(([_, value]) => value !== '')
      );
      buildAgent(payload, project);
    }
  }

  const isFormValid = () => {
    const isNameValid = !!name.trim();
    const isKnowledgeValid = !!knowledge.trim() && isValidURL(knowledge.trim());
    return isNameValid && isKnowledgeValid && isIntegrated;
  };

  return (
    <Container>
      <Page>
        <PageHeader>
          <PageHeaderRow
            style={{
              justifyContent: 'space-between',
              gap: 'var(--sl-space-3)',
            }}
          >
            <PageHeading
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <IconButton variant="tertiary" label="Actions" onClick={navigateBack}>
                <IconArrowLeft />
              </IconButton>
              New Agent
            </PageHeading>
            <Button
              variant="primary"
              size="large"
              onClick={createAgent}
              disabled={!isFormValid()}
            >
              {t('common.continue')}
            </Button>
          </PageHeaderRow>
        </PageHeader>

        <PageContent style={{ maxWidth: '720px', padding: '0' }}>
          <Flex direction="column" gap={'24px'}>
            <Flex>
              <Text variant="display3">Set your agent’s persona</Text>
            </Flex>
            <Flex direction="row">
              <form style={{ width: '100%' }}>
                <Flex direction="column" gap={'20px'}>
                  <Field error={error.name}>
                    <Label>Name</Label>
                    <Input name="name" value={name} onChange={setName} />
                    <FieldError>{errorMessage.name}</FieldError>
                  </Field>
                  <Field error={error.knowledge}>
                    <Label>
                      <Flex align="center" gap="$space-05">
                        {t('agent.setup.forms.knowledge.title')}
                        <Tooltip label={t('agent.setup.forms.knowledge.context')}>
                          <span>
                            <img src={question} alt="" />
                          </span>
                        </Tooltip>
                      </Flex>
                    </Label>
                    <Input
                      prefix="https://"
                      name="knowledge"
                      value={knowledge}
                      onChange={setKnowledge}
                    />
                    <FieldError>{errorMessage.knowledge}</FieldError>
                  </Field>

                  <Field>
                    <Label>{t('agent.setup.forms.occupation')}</Label>
                    <Input name="occupation" value={occupation} onChange={setOccupation} />
                  </Field>

                  <Field>
                    <Label>{t('agent.setup.forms.objective')}</Label>
                    <Flex>
                      <Textarea
                        name="objective"
                        value={objective}
                        onChange={setObjective}
                        style={{ width: '720px' }}
                      />
                    </Flex>
                  </Field>
                </Flex>
              </form>
            </Flex>
            <Flex direction="column" gap={'24px'}>
              <Text variant="display3">Integrate a support channel</Text>
              <Channel isIntegrated={isIntegrated} />
            </Flex>
          </Flex>
        </PageContent>
      </Page>
    </Container>
  );
}