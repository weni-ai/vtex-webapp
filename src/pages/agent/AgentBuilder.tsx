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
  Radio,
  RadioGroup,
  Spinner,
  Text,
  Textarea,
  Tooltip,
} from '@vtex/shoreline';
import { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { agentBuilderLoading, getAgentBuilder, loadingSetup, setStoreType } from '../../store/projectSlice';
import { isAgentBuilderIntegrated, isWhatsAppIntegrated } from '../../store/userSlice';
import { useAgentBuilderSetup } from '../setup/useAgentBuilderSetup';
import { useUserSetup } from '../setup/useUserSetup';
import { AgentBuilderSkeleton } from './AgentBuilderSkeleton';
import { Channel } from '../Channel';
import { useNavigate } from 'react-router-dom';
import question from '../../assets/icons/question.svg'
import { TermsAndConditions } from '../../components/TermsAndConditions';
import { cleanURL } from '../../utils';
import store from '../../store/provider.store';
import { VTEXFetch } from '../../utils/VTEXFetch';

interface FormState {
  name: string;
  knowledge: string;
  occupation: string;
  objective: string;
  channel: string;
}

async function updateStoreType(storeType: string) {
  const projectUuid = store.getState().project.project_uuid;

  await VTEXFetch('/_v/set-vtex-store-type', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "projectUUID": projectUuid,
      "vtexStoreType": storeType,
    }),
  });

  store.dispatch(setStoreType(storeType));
}

export function AgentBuilder() {
  const [form, setForm] = useState<FormState>({
    name: useSelector(getAgentBuilder).name || '',
    knowledge: useSelector(getAgentBuilder).links[0] || '',
    occupation: useSelector(getAgentBuilder).occupation || t('agent.setup.forms.occupation.default'),
    objective: useSelector(getAgentBuilder).objective || t('agent.setup.forms.objective.default'),
    channel: store.getState().project.storeType || '',
  });
  const [errors, setErrors] = useState<{ [key in keyof FormState]?: string }>({});
  const [openTerms, setOpenTerms] = useState(false)
  const isWppIntegrated = useSelector(isWhatsAppIntegrated);
  const isSetupLoading = useSelector(loadingSetup);
  const isAgentBuilderLoading = useSelector(agentBuilderLoading)
  const agentIntegrated = useSelector(isAgentBuilderIntegrated)
  const { buildAgent } = useAgentBuilderSetup();
  const { initializeUser } = useUserSetup();
  const navigate = useNavigate()
  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  const isValidURL = (url: string) => {
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}([/?#].*)?$/i;
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

  const handleInputChange = (field: keyof FormState, value: string) => {
    if (field === 'knowledge') {
      value = cleanURL(value);
    }

    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const handleOpenTerms = () => {
    if (validateForm() && isWppIntegrated) {
      setOpenTerms(true)
    }
  }

  const handleSubmit = async () => {
    const payload = Object.fromEntries(
      Object.entries(form).filter(([_, value]) => value.trim())
    ) as FormState;

    buildAgent(payload);
    setOpenTerms(false);

    await updateStoreType(form.channel);
  };

  return (
    <Container>
      <Page style={{ height: '100vh' }}>
        <PageHeader>
          <PageHeaderRow style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <PageHeading style={{ display: 'flex', alignItems: 'center' }}>
              <IconButton label='' variant="tertiary">
                <IconArrowLeft onClick={() => navigate('/agent-details')} />
              </IconButton>
              <Text>{t('common.new_agent')}</Text>
            </PageHeading>
            <Button variant="primary" size="large" onClick={handleOpenTerms} disabled={!isWppIntegrated || isAgentBuilderLoading || !form.channel}>
              {isAgentBuilderLoading ? <Spinner description="loading" /> : <span>{t('common.create')}</span>}
            </Button>
          </PageHeaderRow>
        </PageHeader>
        <PageContent style={{ maxWidth: '720px', padding: 0 }}>
          <Flex direction="row" gap="var(--space-5, 20px)" style={{ marginBottom: 'var(--space-5, 20px)' }}>
            <RadioGroup
              label={t('agent.setup.forms.channel.title')}
              defaultValue={form.channel}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, channel: e.target.value })}
            >
              <Flex direction="row" gap="var(--space-5, 20px)">
                <Radio value={'faststore'} checked={form.channel === 'faststore'}>{t('agent.setup.forms.channel.faststore')}</Radio>
                <Radio value={'portal'} checked={form.channel === 'portal'}>{t('agent.setup.forms.channel.portal')}</Radio>
                <Radio value={'site_editor'} checked={form.channel === 'site_editor'}>{t('agent.setup.forms.channel.site_editor')}</Radio>
              </Flex>
            </RadioGroup>
          </Flex>
          {isSetupLoading ? (
            <AgentBuilderSkeleton />
          ) : (
            <Flex direction="column" gap="var(--space-5, 20px)">
              <Flex direction="column" gap="var(--space-5, 20px)">
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
                  <Label>{t('agent.setup.forms.occupation.title')}</Label>
                  <Input
                    name="occupation"
                    value={form.occupation}
                    onChange={(e) => handleInputChange('occupation', e)}
                    disabled={agentIntegrated}
                  />
                </Field>
                <Field>
                  <Label>{t('agent.setup.forms.objective.title')}</Label>
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
              <Channel isIntegrated={isWppIntegrated} />
            </Flex>
          )}
        </PageContent>
      </Page>
      <TermsAndConditions open={openTerms} dismiss={() => setOpenTerms(false)} approve={handleSubmit} />
    </Container>
  );
}
