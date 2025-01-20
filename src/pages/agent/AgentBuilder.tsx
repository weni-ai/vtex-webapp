/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  Container,
  Field,
  FieldError,
  Flex,
  IconArrowLeft,
  IconButton,
  Input,
  Label,
  Page,
  PageContent,
  PageHeader,
  PageHeaderRow,
  PageHeading,
  Spinner,
  Text,
  Textarea,
  Tooltip,
} from '@vtex/shoreline';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { agentLoading, getAgent, loadingSetup, selectProject } from '../../store/projectSlice';
import { isAgentIntegrated, isWhatsAppIntegrated } from '../../store/userSlice';
import { useAgentBuilderSetup } from '../setup/useAgentBuilderSetup';
import { useUserSetup } from '../setup/useUserSetup';
import { AgentBuilderSkeleton } from './AgentBuilderSkeleton';
import { Channel } from '../Channel';
import { useNavigate } from 'react-router-dom';
import question from '../../assets/icons/question.svg'

interface FormState {
  name: string;
  knowledge: string;
  occupation: string;
  objective: string;
}

export function AgentBuilder() {
  const [form, setForm] = useState<FormState>({
    name: useSelector(getAgent).name || '',
    knowledge: useSelector(getAgent).links[0] || '',
    occupation: useSelector(getAgent).occupation || '',
    objective: useSelector(getAgent).objective || '',
  });
  const [errors, setErrors] = useState<{ [key in keyof FormState]?: string }>({});
  const project = useSelector(selectProject);
  const isIntegrated = useSelector(isWhatsAppIntegrated);
  const isSetupLoading = useSelector(loadingSetup);
  const isAgentLoading = useSelector(agentLoading)
  const agentIntegrated = useSelector(isAgentIntegrated)
  const { buildAgent } = useAgentBuilderSetup();
  const { initializeUser } = useUserSetup();
  const navigate = useNavigate()

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  const isValidURL = (url: string) => {
    const urlPattern = /^[^\s]+\.com([/?#].*)?$/i;
    return urlPattern.test(url);
  };

  const validateForm = () => {
    const newErrors: { [key in keyof FormState]?: string } = {
      name: !form.name.trim() ? t('agent.setup.forms.error.empty_input') : '',
      knowledge: !form.knowledge.trim()
        ? t('agent.setup.forms.error.empty_input')
        : !isValidURL(form.knowledge.trim())
          ? t('agent.setup.forms.error.valid_url')
          : '',
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleInputChange = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    if (validateForm() && isIntegrated) {
      const payload = Object.fromEntries(
        Object.entries(form).filter(([_, value]) => value.trim())
      );
      console.log('funfou')
      buildAgent(payload, project);
    }
  };

  return (
    <Container>
      <Page style={{ height: '100vh' }}>
        <PageHeader>
          <PageHeaderRow style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <PageHeading style={{ display: 'flex', alignItems: 'center' }}>
              <IconButton label='' variant="tertiary" onClick={() => navigate('/')}>
                <IconArrowLeft onClick={() => navigate('/agent-details')} />
              </IconButton>
              <Text>{t('common.new_agent')}</Text>
            </PageHeading>
            <Button variant="primary" size="large" onClick={handleSubmit} disabled={!isIntegrated}>
              {isAgentLoading ? <Spinner description="loading" /> : <span>{t('common.create')}</span>}
            </Button>
          </PageHeaderRow>
        </PageHeader>

        <PageContent style={{ maxWidth: '720px', padding: 0 }}>
          {isSetupLoading ? (
            <AgentBuilderSkeleton />
          ) : (
            <Flex direction="column" gap="24px">
              <Flex direction="column" gap="20px">
                <Field error={!!errors.name}>
                  <Label>{t('agent.setup.forms.name')}</Label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={(e) => handleInputChange('name', e)}
                    disabled={agentIntegrated}
                  />
                  <FieldError>{errors.name}</FieldError>
                </Field>
                <Field error={!!errors.knowledge}>
                  <Label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-05, 2px)' }}>
                    {t('agent.setup.forms.knowledge.title')}
                    <Tooltip label={t('agent.setup.forms.knowledge.context')}>
                      <Flex style={{ width: '24px', justifyContent: 'center' }}>
                        <img src={question} alt="" />
                      </Flex>
                    </Tooltip>
                  </Label>
                  <Input
                    name="knowledge"
                    value={form.knowledge}
                    onChange={(e) => handleInputChange('knowledge', e)}
                    disabled={agentIntegrated}
                    prefix={'https://'}
                  />
                  <FieldError>{errors.knowledge}</FieldError>
                </Field>
                <Field>
                  <Label>{t('agent.setup.forms.occupation')}</Label>
                  <Input
                    name="occupation"
                    value={form.occupation}
                    onChange={(e) => handleInputChange('occupation', e)}
                    disabled={agentIntegrated}
                  />
                </Field>
                <Field>
                  <Label>Objective</Label>
                  <Textarea
                    name="objective"
                    value={form.objective}
                    onChange={(e) => handleInputChange('objective', e)}
                    style={{ minWidth: '720px' }}
                    disabled={agentIntegrated}
                  />
                </Field>
              </Flex>
              <Text variant="display3">{t('integration.title')}</Text>
              <Channel isIntegrated={isIntegrated} />
            </Flex>
          )}
        </PageContent>
      </Page>
    </Container>
  );
}
