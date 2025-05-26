import { Bleed, Button, Divider, Flex, Grid, IconArrowLeft, IconButton, Page, PageContent, PageHeader, PageHeaderRow, PageHeading, Stack, Text, toast } from "@vtex/shoreline";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TemplateStatusTag } from "../../components/TemplateCard";
import { assignedAgentTemplate, updateAgentTemplate } from "../../services/agent.service";
import { FormContent } from "./FormContent";
import { FormEssential } from "./FormEssential";
import { FormVariables } from "./FormVariables";
import { MessagePreview } from "./MessagePreview";
import { AddingVariableModal } from "./modals/AddingVariable";
import './Template.style.css';

export interface Content {
  header?: { type: 'text', text: string } | { type: 'media', file?: File, previewSrc?: string };
  content: string;
  footer?: string;
  button?: { text: string; url: string };
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

export function Template() {
  const navigate = useNavigate();
  const { templateUuid } = useParams();

  const [templateName, setTemplateName] = useState('');
  const [templateStatus, setTemplateStatus] = useState<"active" | "pending" | "rejected" | "needs-editing">('active');
  const [startCondition, setStartCondition] = useState('');

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

  useEffect(() => {
    if (templateUuid) {
      loadTemplate();
    }
  }, [templateUuid]);

  const isEditing = useMemo(() => {
    return templateUuid !== undefined;
  }, [templateUuid]);

  async function loadTemplate() {
    const template = await assignedAgentTemplate({ templateUuid: templateUuid as string });

    let header: { type: 'text', text: string } | undefined;
    let button: { text: string; url: string } | undefined;
    let footer: string | undefined;

    if (template.metadata.buttons?.[0]?.type === 'URL') {
      button = {
        text: template.metadata.buttons[0].text,
        url: template.metadata.buttons[0].url,
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
    setStartCondition(template.startCondition);

    setPrefilledContent({
      header,
      content: template.metadata.body,
      footer,
      button,
    });
  }

  async function handleSaveTemplate() {
    try {
      setIsSaving(true);

      await updateAgentTemplate({
        templateUuid: templateUuid as string,
        template: {
          header: content.header?.type === 'text' ? content.header.text : undefined,
          content: content.content,
          footer: content.footer,
        },
      });

      navigate(-1);

      toast.success(t('agent.actions.edit_template.success'));
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
                onClick={() => navigate(-1)}
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

            {/* <Tag variant="secondary" color="yellow">Pending</Tag> */}
          </Flex>

          <Stack space="$space-3" horizontal>
            <Bleed top="$space-2" bottom="$space-2">
              <Button variant="secondary" size="large">
                {t('template.form.create.buttons.cancel')}
              </Button>
            </Bleed>

            <Bleed top="$space-2" bottom="$space-2">
              <Button variant="primary" size="large" onClick={handleSaveTemplate} loading={isSaving}>
                {t('template.form.create.buttons.save')}
              </Button>
            </Bleed>
          </Stack>
        </PageHeaderRow>
      </PageHeader>

      <PageContent>
        <Flex direction="column" gap="$space-5">
          <FormEssential startCondition={startCondition} isDisabled={isEditing} />

          <Divider />

          <Grid columns="1fr 1fr" gap="$space-5">
            <FormContent
              content={content}
              setContent={setContent}
              prefilledContent={prefilledContent}
              canAddElements={!isEditing}
              canRemoveElements={!isEditing}
              canChangeHeaderType={!isEditing}
              canChangeButton={!isEditing}
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
              onClose={() => setIsAddingVariableModalOpen(false)}
              addVariable={(variable: Variable) => {
                setVariables([...variables, variable]);
              }}
            />
          </>)}
        </Flex>
      </PageContent>
    </Page>
  )
}
