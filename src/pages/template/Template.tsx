import { Alert, Bleed, Button, Divider, Flex, Grid, IconArrowLeft, IconButton, Page, PageContent, PageHeader, PageHeaderRow, PageHeading, Stack, Text, toast } from "@vtex/shoreline";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import { TemplateStatusTag } from "../../components/TemplateCard";
import { agentCLI, assignedAgentTemplate, createAssignedAgentTemplate, saveAgentButtonTemplate, updateAgentGlobalRule, updateAgentTemplate } from "../../services/agent.service";
import { FormContent } from "./FormContent";
import { FormEssential } from "./FormEssential";
import { FormVariables } from "./FormVariables";
import { MessagePreview } from "./MessagePreview";
import { AddingVariableModal } from "./modals/AddingVariable";
import { ProcessModal } from "./modals/Process";
import './Template.style.css';
import { cleanURL } from "../../utils";

function normalizeItems(language: string, items: string[]) {
  return new Intl.ListFormat(language, { style: 'long', type: 'conjunction' }).format(items);
}

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export interface Content {
  header?: { type: 'text', text: string } | { type: 'media', file?: File, previewSrc?: string };
  content: string;
  footer?: string;
  button?: { text: string; url: string, urlExample?: string };
}

export interface Variable {
  definition: string;
  fallbackText: string;
}

export function SectionHeader({ title }: { title: string }) {
  return (
    <Text variant="display2" color="$fg-base">
      {title}
    </Text>
  )
}

function TemplateAlert({ variant, message, dataTestId }: { variant: "warning" | "critical", message: string, dataTestId?: string }) {
  return (
    <Alert variant={variant} style={{ marginBottom: 'var(--sl-space-8)' }} data-testid={dataTestId}>
      <Text variant="body">
        <Markdown>{message}</Markdown>
      </Text>
    </Alert>
  )
}

export function Template({ templateUuid: propTemplateUuid, abandonedCartHeaderImageType, loadAgentDetails }: { templateUuid?: string, abandonedCartHeaderImageType?: 'first_item' | 'most_expensive', loadAgentDetails?: () => void }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { assignedAgentUuid, templateUuid: paramTemplateUuid } = useParams();
  const { i18n } = useTranslation();

  const templateUuid = useMemo(() => propTemplateUuid || paramTemplateUuid, [propTemplateUuid, paramTemplateUuid]);

  const [previousTemplateName, setPreviousTemplateName] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [templateStatus, setTemplateStatus] = useState<"active" | "pending" | "rejected" | "needs-editing">('active');
  const [previousStartCondition, setPreviousStartCondition] = useState('');
  const [startCondition, setStartCondition] = useState('');
  const [templateIsCustom, setTemplateIsCustom] = useState(false);

  const [isSimplifiedView, setIsSimplifiedView] = useState(false);

  useEffect(() => {
    if (templateName.toLowerCase() === 'abandoned cart') {
      setIsSimplifiedView(true);
    } else {
      setIsSimplifiedView(false);
    }
  }, [templateName]);

  const [abandonedCartHeaderImageTypeState, setAbandonedCartHeaderImageTypeState] = useState<typeof abandonedCartHeaderImageType>(abandonedCartHeaderImageType || 'first_item');

  const hasAbandonedCartHeaderImageTypeChanged = useMemo(() => {
    return abandonedCartHeaderImageType !== abandonedCartHeaderImageTypeState;
  }, [abandonedCartHeaderImageType, abandonedCartHeaderImageTypeState]);

  const [temporaryContentText, setTemporaryContentText] = useState('');

  const [content, setContent] = useState<Content>({
    header: undefined,
    content: '',
    footer: undefined,
    button: undefined,
  });

  const [prefilledContent, setPrefilledContent] = useState<Content>({
    header: undefined,
    content: '',
    footer: undefined,
    button: undefined,
  });

  const [isAddingVariableModalOpen, setIsAddingVariableModalOpen] = useState(false);
  const [previousVariables, setPreviousVariables] = useState<Variable[]>([]);
  const [variables, setVariables] = useState<Variable[]>([]);

  const [isSaving, setIsSaving] = useState(false);

  const [isCreatingTemplateModalOpen, setIsCreatingTemplateModalOpen] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');

  const [templateNameError, setTemplateNameError] = useState('');
  const [startConditionError, setStartConditionError] = useState('');

  const [variablesError, setVariablesError] = useState<{
    field: string,
    message: string,
  }[]>([]);

  const [processModalSpecificProps, setProcessModalSpecificProps] = useState<{ processingText: string, steps: string[] }>({
    processingText: '',
    steps: [],
  });

  useEffect(() => {
    if (typeof document !== 'undefined' && document?.body?.style) {
      document.body.style.overflow = '';
    }
  }, []);

  useEffect(() => {
    if (templateUuid) {
      loadTemplate();
    }
  }, [templateUuid]);

  const hasVariablesChanged = useMemo(() => {
    if (previousVariables.length !== variables.length) {
      return true;
    }

    return previousVariables.some(
      (variable, index) =>
        variable.definition !== variables[index].definition ||
        variable.fallbackText !== variables[index].fallbackText
    )
  }, [previousVariables, variables]);

  const isCreating = useMemo(() => {
    return templateUuid === undefined;
  }, [templateUuid]);

  const isEditing = useMemo(() => {
    return templateUuid !== undefined;
  }, [templateUuid]);

  const hasChanges = useMemo(() => {
    let header = prefilledContent.header?.type === 'media' && content.header?.type === 'media' && prefilledContent.header?.previewSrc !== content.header?.previewSrc;

    if (isSimplifiedView) {
      if (prefilledContent.header?.type === undefined && content.header?.type === undefined) {
        header = false;
      } else {
        header = !(prefilledContent.header?.type === 'media' && content.header?.type === 'media');
      }
    }
    
    return [
      hasVariablesChanged,
      previousTemplateName !== templateName,
      previousStartCondition !== startCondition,
      prefilledContent.content !== content.content,
      prefilledContent.header?.type !== content.header?.type,
      prefilledContent.header?.type === 'text' && content.header?.type === 'text' && prefilledContent.header?.text !== content.header?.text,
      header,
      prefilledContent.footer !== content.footer,
      prefilledContent.button?.text !== content.button?.text,
      cleanURL(prefilledContent.button?.url || '') !== cleanURL(content.button?.url || ''),
      cleanURL(prefilledContent.button?.urlExample || '') !== cleanURL(content.button?.urlExample || ''),
    ].some(Boolean);
  }, [content, prefilledContent, previousStartCondition, startCondition, hasVariablesChanged, previousTemplateName, templateName]);

  async function loadTemplate() {
    const template = await assignedAgentTemplate({ templateUuid: templateUuid as string });

    let header: { type: 'text', text: string } | { type: 'media', file: File, previewSrc: string } | undefined;
    let button: { text: string; url: string, urlExample?: string } | undefined;
    let footer: string | undefined;

    if (template.metadata.buttons?.[0]?.type === 'URL') {
      button = {
        text: template.metadata.buttons[0].text,
        url: template.metadata.buttons[0].url,
        urlExample: template.metadata.buttons[0].example?.[0],
      }
    }

    if (template.metadata.header) {
      if (template.metadata.header.startsWith('https://')) {
        const fileName = template.metadata.header.split('/').pop() || 'header.jpg';

        header = {
          type: 'media',
          file: new File([], fileName),
          previewSrc: template.metadata.header,
        }
      } else {
        header = {
          type: 'text',
          text: template.metadata.header,
        }
      }
    }

    if (template.metadata.footer) {
      footer = template.metadata.footer;
    }

    setPreviousTemplateName(template.name);
    setTemplateName(template.name);

    setTemplateStatus(template.status as "active" | "pending" | "rejected" | "needs-editing");
    setTemplateIsCustom(template.isCustom);

    setPreviousStartCondition(template.startCondition);
    setStartCondition(template.startCondition);

    if (!template.isCustom) {
      const variables = (template.metadata.body_params || []).map((fallback, index) => ({
        definition: t('template.form.areas.variables.variable_name', { variableName: `{{${index + 1}}}`, }),
        fallbackText: fallback,
      }));

      setPreviousVariables(variables);
      setVariables(variables);
    } else if (template.variables) {
      const variables = template.variables.map((variable) => ({
        definition: variable.definition,
        fallbackText: variable.fallback,
      }));

      setPreviousVariables(variables);
      setVariables(variables);
    }

    setPrefilledContent({
      header,
      content: template.metadata.body,
      footer,
      button,
    });
  }

  const templateHeaderAsFinalObject = useMemo(() => {
    let header: { type: 'media', src: string } | { type: 'text', text: string } | undefined;

    if (content.header?.type === 'media' && content.header.previewSrc) {
      header = {
        type: 'media' as const,
        src: content.header.previewSrc,
      }
    } else if (content.header?.type === 'text' && content.header.text) {
      header = {
        type: 'text' as const,
        text: content.header.text,
      }
    }

    return header;
  }, [content.header]);

  async function handleSaveTemplate() {
    if (templateUuid === undefined) {
      createTemplate();
      return;
    }

    if (templateStatus === 'needs-editing') {
      handleSaveButton();
      return;
    }

    const hasStartConditionChanged = previousStartCondition !== startCondition;
    const mustBeProcessedByAI = hasStartConditionChanged || hasVariablesChanged;

    try {
      setErrorText('');
      setSuccessText('');
      setIsSaving(true);

      if (mustBeProcessedByAI) {
        setIsCreatingTemplateModalOpen(true);
        setProcessModalSpecificProps({
          processingText: t('template.modals.edit.steps.processing.description'),
          steps: [
            'analyzing_defined_requirements',
            'reviewing_start_condition_structure',
            'validating_inserted_content',
            'optimizing_start_condition_for_fast_delivery',
            'performing_final_security_checks',
          ],
        });
      }

      const templateHeaderAsString =
        templateHeaderAsFinalObject?.type === 'text' ?
          templateHeaderAsFinalObject.text :
          templateHeaderAsFinalObject?.type === 'media' ?
            templateHeaderAsFinalObject.src :
            undefined;

      await updateAgentTemplate({
        templateUuid: templateUuid,
        template: {
          header: templateHeaderAsString,
          content: content.content,
          footer: content.footer,
          button: content.button,
          variables: variables.map((variable) => ({
            definition: variable.definition,
            fallback: variable.fallbackText,
          })),
          ...(mustBeProcessedByAI ? {
            startCondition: startCondition,
          } : {}),
        },
      });

      await updateTemplates();

      if (mustBeProcessedByAI) {
        setSuccessText(t('agent.actions.edit_template.success'));
      } else {
        toast.success(t('agent.actions.edit_template.success'));
        navigateToAgent();
      }

    } catch (error) {
      if (error instanceof Error) {
        if (mustBeProcessedByAI) {
          setErrorText(error.message);
        } else {
          let errorMessage = error.message;

          if (errorMessage === 'request entity too large') {
            errorMessage = t('template.form.fields.errors.file_too_large');
          }

          toast.critical(errorMessage);
        }
      }
    } finally {
      setIsSaving(false);
    }
  }

  const createCustomTemplatePayload = useMemo(() => {
    return {
      name: templateName,
      header: templateHeaderAsFinalObject,
      body: content.content,
      footer: content.footer,
      button: content.button,
      assignedAgentUuid: assignedAgentUuid as string,
      startCondition: startCondition,
      variables: variables.map((variable) => ({
        definition: variable.definition,
        fallback: variable.fallbackText,
      })),
    }
  }, [templateName, content, startCondition, variables, assignedAgentUuid]);

  async function createTemplate() {
    try {
      setErrorText('');
      setSuccessText('');

      if (validateTemplate() === false) {
        return;
      }

      setIsSaving(true);
      setIsCreatingTemplateModalOpen(true);
      setProcessModalSpecificProps({
        processingText: t('template.modals.create.steps.processing.description'),
        steps: [
          'analyzing_defined_requirements',
          'reviewing_template_structure',
          'validating_inserted_content',
          'adjusting_custom_variables',
          'optimizing_template_for_fast_delivery',
          'performing_final_security_checks',
        ],
      });

      await createAssignedAgentTemplate(createCustomTemplatePayload);

      setSuccessText(t('template.modals.create.success'));
      await updateTemplates();
    } catch (error) {
      if (error instanceof Error) {
        setErrorText(error.message);
      }
    } finally {
      setIsSaving(false);
    }
  }

  function validateTemplate() {
    let isValid = true;

    if (templateName.trim().length === 0) {
      setTemplateNameError(t('agent.setup.forms.error.empty_input'));
      isValid = false;
    }

    if (startCondition.trim().length === 0) {
      setStartConditionError(t('agent.setup.forms.error.empty_input'));
      isValid = false;
    }

    return isValid;
  }

  async function handleSaveButton() {
    try {
      setIsSaving(true);

      await saveAgentButtonTemplate({
        templateUuid: templateUuid as string,
        template: {
          button: {
            url: content.button?.url ? `https://${content.button.url.trim()}` : '',
            urlExample: content.button?.urlExample ? `https://${content.button.urlExample.trim()}` : undefined,
          },
        },
      });

      toast.success(t('agent.actions.edit_template.success'));

      await updateTemplates();
      navigateToAgent();
    } catch (error) {
      toast.critical(`${t('error.title')}! ${t('error.description')}`);
    } finally {
      setIsSaving(false);
    }
  }

  async function updateTemplates() {
    await agentCLI({ agentUuid: assignedAgentUuid as string, forceUpdate: true });
  }

  function navigateToAgent() {
    navigate(`/agents/${assignedAgentUuid}`);
  }

  useEffect(() => {
    if (templateNameError) {
      setTemplateNameError('');
    }
  }, [templateName]);

  useEffect(() => {
    if (startConditionError) {
      setStartConditionError('');
    }
  }, [startCondition]);

  useEffect(() => {
    const errors: typeof variablesError = [];

    variables.forEach((variable, index) => {
      const fields = ['definition', 'fallbackText'] as const;

      fields.forEach((field) => {
        if (variable[field].trim().length === 0) {
          errors.push({
            field: `variable-${index + 1}-${field}`,
            message: t('template.form.fields.errors.required'),
          });
        }
      });
    });

    const missingVariables: string[] = [];

    variables.forEach((_variable, index) => {
      const variableNumber = index + 1;

      if (!content.content.includes(`{{${variableNumber}}}`)) {
        missingVariables.push(`{{${variableNumber}}}`);
      }
    });

    if (missingVariables.length > 0) {
      errors.push({
        field: 'content',
        message: t('template.form.fields.errors.missing_variable', {
          count: missingVariables.length,
          variables: normalizeItems(i18n.language, missingVariables),
        }),
      });
    }

    const variablesNumbers =
      content.content
        .match(/{{(\d+)}}/g)
        ?.filter((value, index, array) => array.indexOf(value) === index)
        .map((value) => Number(value.replace('{{', '').replace('}}', '')))
      || [];

    const variablesNotDefined = variablesNumbers.filter(variableNumber => variableNumber > variables.length);

    if (variablesNotDefined.length > 0) {
      errors.push({
        field: 'content',
        message: t('template.form.fields.errors.undefined_variable', {
          count: variablesNotDefined.length,
          variables: normalizeItems(i18n.language, variablesNotDefined.map(variableNumber => `{{${variableNumber}}}`)),
        }),
      });
    }

    const groupedMessagesByField = errors.map(error => ({
      ...error,
      message: capitalize(normalizeItems(i18n.language, errors.filter(e => e.field === error.field).map(e => e.message))),
    }));

    const uniqueErrorsByField = groupedMessagesByField.filter((error, index, self) =>
      index === self.findIndex((t) => t.field === error.field)
    );

    setVariablesError(uniqueErrorsByField);
  }, [variables, content.content]);

  async function handleSaveAbandonedCartHeaderImageType() {
    try {
      setIsSaving(true);
      await updateAgentGlobalRule({
        agentUuid: assignedAgentUuid as string,
        abandonedCartHeaderImageType: abandonedCartHeaderImageTypeState,
      });
      
      await loadAgentDetails?.();

      const isDisabled = !hasChanges || !!templateNameError || !!startConditionError || variablesError.length > 0;

      if (!isDisabled) {
        await handleSaveTemplate();
      }
    } catch (error) {
      toast.critical(`${t('error.title')}! ${t('error.description')}`);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Page>
      <PageHeader>
        <PageHeaderRow>
          <Flex align="center">
            <Bleed top="$space-2" bottom="$space-2">
              <IconButton
                label={t('common.return')}
                asChild
                variant="tertiary"
                size="large"
                onClick={navigateToAgent}
              >
                <IconArrowLeft />
              </IconButton>
            </Bleed>

            {isEditing ? (
              <PageHeading>
                <Flex align="center" gap="$space-3">
                  {templateName}

                  <TemplateStatusTag status={templateStatus} size="large" />
                </Flex>
              </PageHeading>
            ) : (
              <PageHeading>{t('template.form.create.title')}</PageHeading>
            )}
          </Flex>

          <Stack space="$space-3" horizontal>
            <Bleed top="$space-2" bottom="$space-2">
              <Button variant="secondary" size="large" onClick={navigateToAgent}>
                {t('template.form.create.buttons.cancel')}
              </Button>
            </Bleed>

            <Bleed top="$space-2" bottom="$space-2">
              {
                hasAbandonedCartHeaderImageTypeChanged ? 
                  <Button
                  variant="primary"
                  size="large"
                  onClick={handleSaveAbandonedCartHeaderImageType}
                  loading={isSaving}
                  data-testid="save-button"
                >
                  {t('template.form.create.buttons.save')}
                </Button>
              :
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleSaveTemplate}
                  loading={isSaving}
                  disabled={!hasChanges || !!templateNameError || !!startConditionError || variablesError.length > 0}
                  data-testid="save-button"
                >
                  {t('template.form.create.buttons.save')}
                </Button>
              }
            </Bleed>
          </Stack>
        </PageHeaderRow>
      </PageHeader>

      <PageContent data-testid="page-content">
        {(errorText || templateStatus === 'needs-editing') && (
          <TemplateAlert
            dataTestId="template-alert"
            {...(
              templateStatus === 'needs-editing' ? {
                variant: 'warning',
                message: t('template.form.alerts.needs_editing.description')
              } : {
                variant: 'critical',
                message: errorText
              }
            )}
          />
        )}

        <Flex direction="column" gap="$space-5">
          {!isSimplifiedView && (
            <>
              <FormEssential
                name={templateName}
                setName={setTemplateName}
                nameError={templateNameError}
                isNameEditable={!isEditing}
                startCondition={startCondition}
                setStartCondition={setStartCondition}
                startConditionError={startConditionError}
                isStartConditionEditable={!isEditing || templateIsCustom}
                dataTestId="form-essential"
              />

              <Divider />
            </>
          )}

          <Grid columns="1fr 1fr" gap="$space-5">
            <FormContent
              status={templateStatus}
              content={content}
              setContent={setContent}
              prefilledContent={prefilledContent}
              isHeaderEditable={true}
              isFooterEditable={true}
              isButtonEditable={true}
              isSimplifiedView={isSimplifiedView}
              abandonedCartHeaderImageType={abandonedCartHeaderImageTypeState}
              setAbandonedCartHeaderImageType={setAbandonedCartHeaderImageTypeState}
              canChangeButton={true}
              totalVariables={variables.length}
              addEmptyVariables={(count: number) => {
                const newVariables: Variable[] = [];

                for (let i = 0; i < count; i++) {
                  newVariables.push({
                    definition: '',
                    fallbackText: '',
                  });
                }

                setVariables([...variables, ...newVariables]);
              }}
              openNewVariableModal={(text: string) => {
                setIsAddingVariableModalOpen(true);
                setTemporaryContentText(text);
              }}
              variables={variables.map((variable) => variable.definition)}
              contentError={variablesError.find(error => error.field === 'content')?.message}
              canCreateVariable={isCreating || templateIsCustom}
            />

            <MessagePreview
              header={content.header}
              contentText={content.content}
              footer={content.footer}
              buttonText={content.button?.text}
            />
          </Grid>

          {(isCreating || templateIsCustom) && (<>
            {!isSimplifiedView && (
              <>
                <Divider />

                <FormVariables
                  variables={variables}
                  setVariables={setVariables}
                  openAddingVariableModal={() => setIsAddingVariableModalOpen(true)}
                  variablesError={variablesError}
                />
              </>
            )}

            <AddingVariableModal
              open={isAddingVariableModalOpen}
              onClose={() => {
                setIsAddingVariableModalOpen(false);
                setTemporaryContentText('');
              }}
              addVariable={(variable: Variable) => {
                if (temporaryContentText) {
                  setPrefilledContent({
                    ...prefilledContent,
                    content: temporaryContentText.replace(/{{toBeReplaced(}})?/, `{{${variables.length + 1}}}`),
                  });
                }

                setVariables([...variables, variable]);
              }}
            />
          </>)}
        </Flex>

        <ProcessModal
          errorText={errorText}
          successText={successText}
          open={isCreatingTemplateModalOpen}
          onClose={() => {
            setIsCreatingTemplateModalOpen(false);

            if (successText) {
              navigateToAgent();
            }
          }}
          {...processModalSpecificProps}
        />
      </PageContent>
    </Page>
  )
}
