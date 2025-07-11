import { Alert, Bleed, Button, Divider, Flex, Grid, IconArrowLeft, IconButton, Page, PageContent, PageHeader, PageHeaderRow, PageHeading, Stack, Text, toast } from "@vtex/shoreline";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TemplateStatusTag } from "../../components/TemplateCard";
import { agentCLI, assignedAgentTemplate, createAssignedAgentTemplate, saveAgentButtonTemplate, updateAgentTemplate } from "../../services/agent.service";
import { FormContent } from "./FormContent";
import { FormEssential } from "./FormEssential";
import { FormVariables } from "./FormVariables";
import { MessagePreview } from "./MessagePreview";
import { AddingVariableModal } from "./modals/AddingVariable";
import './Template.style.css';
import Markdown from "react-markdown";
import { ProcessModal } from "./modals/Process";

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

function TemplateAlert({ variant, message }: { variant: "warning" | "critical", message: string }) {
  return (
    <Alert variant={variant} style={{ marginBottom: 'var(--sl-space-8)' }}>
      <Text variant="body">
        <Markdown>{message}</Markdown>
      </Text>
    </Alert>
  )
}

export function Template() {
  const navigate = useNavigate();
  const { assignedAgentUuid, templateUuid } = useParams();

  const [templateName, setTemplateName] = useState('');
  const [templateStatus, setTemplateStatus] = useState<"active" | "pending" | "rejected" | "needs-editing">('active');
  const [previousStartCondition, setPreviousStartCondition] = useState('');
  const [startCondition, setStartCondition] = useState('');
  const [templateIsCustom, setTemplateIsCustom] = useState(false);

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
  const [variables, setVariables] = useState<Variable[]>([]);

  const [isSaving, setIsSaving] = useState(false);

  const [isCreatingTemplateModalOpen, setIsCreatingTemplateModalOpen] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');

  const [templateNameError, setTemplateNameError] = useState('');
  const [startConditionError, setStartConditionError] = useState('');

  const [processModalSpecificProps, setProcessModalSpecificProps] = useState<{ processingText: string, steps: string[] }>({
    processingText: '',
    steps: [],
  });

  useEffect(() => {
    if (templateUuid) {
      loadTemplate();
    }
  }, [templateUuid]);

  const isEditing = useMemo(() => {
    return templateUuid !== undefined;
  }, [templateUuid]);

  const hasChanges = useMemo(() => {
    return [
      previousStartCondition !== startCondition,
      prefilledContent.content !== content.content,
      prefilledContent.header?.type !== content.header?.type,
      prefilledContent.header?.type === 'text' && content.header?.type === 'text' && prefilledContent.header?.text !== content.header?.text,
      prefilledContent.footer !== content.footer,
      prefilledContent.button?.text !== content.button?.text,
      prefilledContent.button?.url !== content.button?.url,
      prefilledContent.button?.urlExample !== content.button?.urlExample,
    ].some(Boolean);
  }, [content, prefilledContent, previousStartCondition, startCondition]);

  async function loadTemplate() {
    const template = await assignedAgentTemplate({ templateUuid: templateUuid as string });

    let header: { type: 'text', text: string } | undefined;
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
      header = {
        type: 'text',
        text: template.metadata.header,
      }
    }

    if (template.metadata.footer) {
      footer = template.metadata.footer;
    }

    setTemplateName(template.name);
    setTemplateStatus(template.status as "active" | "pending" | "rejected" | "needs-editing");
    setTemplateIsCustom(template.isCustom);

    setPreviousStartCondition(template.startCondition);
    setStartCondition(template.startCondition);

    setPrefilledContent({
      header,
      content: template.metadata.body,
      footer,
      button,
    });
  }

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

    try {
      setErrorText('');
      setSuccessText('');
      setIsSaving(true);

      if (hasStartConditionChanged) {  
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

      await updateAgentTemplate({
        templateUuid: templateUuid,
        template: {
          startCondition: hasStartConditionChanged ? startCondition : undefined,
          header: content.header?.type === 'text' ? content.header.text : undefined,
          content: content.content,
          footer: content.footer,
          button: content.button,
        },
      });

      await updateTemplates();

      if (hasStartConditionChanged) {
        setSuccessText(t('agent.actions.edit_template.success'));
      } else {
        toast.success(t('agent.actions.edit_template.success'));
      navigateToAgent();
      }

    } catch (error) {
      if (error instanceof Error) {
        if (hasStartConditionChanged) {
          setErrorText(error.message);
        } else {
          toast.critical(error.message);
        }
      }
    } finally {
      setIsSaving(false);
    }
  }

  const createCustomTemplatePayload = useMemo(() => {
    return {
      name: templateName,
      header: content.header?.type === 'text' ? content.header.text : undefined,
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
    try {
      await agentCLI({ agentUuid: assignedAgentUuid as string, forceUpdate: true });
    } catch (error) {
      console.error(error);
    }
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
              <Button variant="primary" size="large" onClick={handleSaveTemplate} loading={isSaving} disabled={!hasChanges || !!templateNameError || !!startConditionError}>
                {t('template.form.create.buttons.save')}
              </Button>
            </Bleed>
          </Stack>
        </PageHeaderRow>
      </PageHeader>

      <PageContent>
        {(errorText || templateStatus === 'needs-editing') && (
          <TemplateAlert
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
          <FormEssential
            name={templateName}
            setName={setTemplateName}
            nameError={templateNameError}
            isNameEditable={!isEditing}
            startCondition={startCondition}
            setStartCondition={setStartCondition}
            startConditionError={startConditionError}
            isStartConditionEditable={!isEditing || templateIsCustom}
          />

          <Divider />

          <Grid columns="1fr 1fr" gap="$space-5">
            <FormContent
              status={templateStatus}
              content={content}
              setContent={setContent}
              prefilledContent={prefilledContent}
              isHeaderEditable={true}
              isFooterEditable={true}
              isButtonEditable={true}
              canChangeHeaderType={!isEditing}
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
            />

            <MessagePreview
              header={content.header}
              contentText={content.content}
              footer={content.footer}
              buttonText={content.button?.text}
            />
          </Grid>

          {!isEditing && (<>
            <Divider />

            <FormVariables
              variables={variables}
              setVariables={setVariables}
              openAddingVariableModal={() => setIsAddingVariableModalOpen(true)}
            />

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
