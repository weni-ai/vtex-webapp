import { Bleed, Button, Divider, Flex, Grid, IconArrowLeft, IconButton, Page, PageContent, PageHeader, PageHeaderRow, PageHeading, Stack, Text } from "@vtex/shoreline";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const [content, setContent] = useState<Content>({
    header: undefined,
    content: '',
    footer: undefined,
    button: undefined,
  });

  const [isAddingVariableModalOpen, setIsAddingVariableModalOpen] = useState(false);
  const [variables, setVariables] = useState<Variable[]>([]);

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

            <PageHeading>{t('template.form.create.title')}</PageHeading>

            {/* <Tag variant="secondary" color="yellow">Pending</Tag> */}
          </Flex>

          <Stack space="$space-3" horizontal>
            <Bleed top="$space-2" bottom="$space-2">
              <Button variant="secondary" size="large">
                {t('template.form.create.buttons.cancel')}
              </Button>
            </Bleed>

            <Bleed top="$space-2" bottom="$space-2">
              <Button variant="primary" size="large">
                {t('template.form.create.buttons.save')}
              </Button>
            </Bleed>
          </Stack>
        </PageHeaderRow>
      </PageHeader>

      <PageContent>
        <Flex direction="column" gap="$space-5">
          <FormEssential />

          <Divider />

          <Grid columns="1fr 1fr" gap="$space-5">
            <FormContent content={content} setContent={setContent} />

            <MessagePreview
              header={content.header}
              contentText={content.content}
              footer={content.footer}
              buttonText={content.button?.text}
            />
          </Grid>

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
        </Flex>
      </PageContent>
    </Page>
  )
}
