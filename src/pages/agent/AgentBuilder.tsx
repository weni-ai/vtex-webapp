import {
  Field,
  FieldError,
  Flex,
  Input,
  Label,
  Textarea,
  Tooltip
} from '@vtex/shoreline';
import { useSelector } from 'react-redux';
import question from '../../assets/icons/question.svg';
import { loadingSetup } from '../../store/projectSlice';
import { cleanURL } from '../../utils';
import { AgentBuilderSkeleton } from './AgentBuilderSkeleton';

export interface FormState {
  name: string;
  knowledge: string;
  occupation: string;
  objective: string;
}

export function AgentBuilder({ form, setForm, errors }: { form: FormState, setForm: (form: FormState) => void, errors: { [key in keyof FormState]?: string } }) {
  const isSetupLoading = useSelector(loadingSetup);
  // const agentIntegrated = useSelector(isAgentBuilderIntegrated)
  const agentIntegrated = false;

  const handleInputChange = (field: keyof FormState, value: string) => {
    if (field === 'knowledge') {
      value = cleanURL(value);
    }

    setForm({ ...form, [field]: value });
  };

  return (
    <>
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
                className="content-textarea-full-width"
                name="objective"
                value={form.objective}
                onChange={(e) => handleInputChange('objective', e)}
                disabled={agentIntegrated}
              />
            </Field>
          </Flex>
        </Flex>
      )}
    </>
  );
}
