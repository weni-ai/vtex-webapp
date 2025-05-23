import { Alert, Bleed, Button, Divider, Field, FieldDescription, Flex, IconButton, IconPlus, IconTrash, IconX, Input, Label, MenuItem, MenuPopover, MenuProvider, MenuTrigger, Radio, RadioGroup, Text, Textarea, useRadioState, VisuallyHidden } from "@vtex/shoreline";
import { SetStateAction, useEffect, useState } from "react";
import { Content, SectionHeader } from "./Template";

export function FormContent({ content, setContent, prefilledContent, canAddElements = true, canRemoveElements = true, canChangeHeaderType = true }: {
  content: Content,
  setContent: React.Dispatch<SetStateAction<Content>>,
  prefilledContent: Content,
  canAddElements?: boolean;
  canRemoveElements?: boolean;
  canChangeHeaderType?: boolean;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [headerType, setHeaderType] = useState<'text' | 'media'>('text');
  const headerTypeState = useRadioState({
    value: headerType,
    setValue: setHeaderType as any,
  });

  const [headerText, setHeaderText] = useState('');
  const [contentText, setContentText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonUrl, setButtonUrl] = useState('');

  const [file, setFile] = useState<File | undefined>(undefined);
  const [filePreview, setFilePreview] = useState<string | undefined>(undefined);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (file) {
      setFile(file);
      setFilePreview(URL.createObjectURL(file));
    }

    e.target.value = '';
  }

  const [elementsVisibility, setElementsVisibility] = useState<Record<keyof typeof elements, boolean>>({
    header: false,
    footer: false,
    button: false,
  });

  useEffect(() => {
    const header = headerType === 'text' ? { type: 'text' as const, text: headerText || ' ' } : { type: 'media' as const, file: file, previewSrc: filePreview };

    setContent({
      ...content,
      header: elementsVisibility.header ? header : undefined,
      content: contentText || ' ',
      footer: elementsVisibility.footer ? footerText : undefined,
      button: elementsVisibility.button ? { text: buttonText, url: buttonUrl } : undefined,
    });
  }, [elementsVisibility, headerType, headerText, filePreview, contentText, footerText, buttonText, buttonUrl]);

  useEffect(() => {
    const visibility = elementsVisibility;

    if (prefilledContent.header?.type === 'text') {
      setHeaderType('text');
      setHeaderText(prefilledContent.header.text);
      visibility.header = true;
    }

    if (prefilledContent.content) {
      setContentText(prefilledContent.content);
    }

    if (prefilledContent.button) {
      setButtonText(prefilledContent.button.text);
      setButtonUrl(prefilledContent.button.url);
      visibility.button = true;
    }

    if (prefilledContent.footer) {
      setFooterText(prefilledContent.footer);
      visibility.footer = true;
    }

    setElementsVisibility(visibility);
  }, [prefilledContent]);

  const elements = {
    header: {
      isVisible: false,
      component: (
        <>
          <Bleed top="$space-7">
            <RadioGroup label="" horizontal state={headerTypeState}>
              <Radio value="text" disabled={!canChangeHeaderType}>{t('template.form.fields.content.header.radio.text.label')}</Radio>
              <Radio value="media" disabled={!canChangeHeaderType}>{t('template.form.fields.content.header.radio.media.label')}</Radio>
            </RadioGroup>
          </Bleed>

          {headerType === 'text' && (
            <Field>
              <Label>{t('template.form.fields.content.header.label')}</Label>

              <Input value={headerText} onChange={setHeaderText} />
            </Field>
          )}

          {headerType === 'media' && (
            <>
              {file ? (
                <Flex gap="$space-2" align="center" justify="space-between">
                  <Text
                    variant="body"
                    color="$fg-accent"
                    style={{
                      flex: 1,
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textDecoration: 'underline',
                    }}
                  >
                    {file.name}
                  </Text>

                  <IconButton variant="secondary" label={t('template.form.areas.content.header.media.buttons.remove')} onClick={() => { setFile(undefined); setFilePreview(undefined); }}>
                    <IconX />
                  </IconButton>
                </Flex>
              ) : (
                <Alert>
                  <Text variant="body">{t('template.form.areas.content.header.media.empty.description')}</Text>
                </Alert>
              )}

              {!file && (
                <Button variant="secondary" size="large" onClick={() => document.getElementById('file-input')?.click()}>
                  <Flex gap="$space-1" align="center">
                    <IconPlus />
                    {t('template.form.areas.content.header.media.buttons.upload')}
                  </Flex>
                </Button>
              )}

              <VisuallyHidden>
                <input id="file-input" type="file" onChange={handleFileChange} />
              </VisuallyHidden>
            </>
          )}
        </>
      ),
    },

    footer: {
      isVisible: false,
      component: (
        <Field>
          <Label>{t('template.form.fields.content.footer.label')}</Label>

          <Input value={footerText} onChange={setFooterText} />
        </Field>
      ),
    },

    button: {
      isVisible: false,
      component: (
        <>
          <Field>
            <Label>{t('template.form.fields.content.button.text.label')}</Label>

            <Input value={buttonText} onChange={setButtonText} />
          </Field>

          <Field>
            <Label>{t('template.form.fields.content.button.url.label')}</Label>

            <Input prefix="https://" value={buttonUrl} onChange={setButtonUrl} />
          </Field>
        </>
      ),
    }
  }

  function setElementVisibility(element: keyof typeof elements, isVisible: boolean) {
    setElementsVisibility({
      ...elementsVisibility,
      [element]: isVisible,
    });
  }

  return (
    <Flex direction="column" gap="$space-4">
      <SectionHeader title={t('template.form.areas.content.title')} />

      <Field>
        <Label>{t('template.form.fields.content.label')}</Label>

        <Textarea
          className="content-textarea-full-width"
          value={contentText}
          onChange={setContentText}
        />

        <FieldDescription>{t('template.form.fields.content.description')}</FieldDescription>
      </Field>

      <Flex
        direction="column"
        style={{
          border: 'var(--sl-border-base)',
          borderRadius: 'var(--sl-radius-2)',
          padding: 'var(--sl-space-4)',
        }}
      >
        {
          Object.keys(elements).filter((element) => elementsVisibility[element as keyof typeof elements]).map((element, index, { length }) => (
            <Flex direction="column" gap="$space-4" key={`element-${index}`}>
              <Flex align="center" gap="$space-2" justify="space-between">
                <Text variant="emphasis" color="$fg-base">{t(`template.form.fields.content.${element}.title`)}</Text>

                <IconButton variant="tertiary" label={t('template.form.areas.content.buttons.remove')} onClick={() => setElementVisibility(element as keyof typeof elements, false)} disabled={!canRemoveElements}>
                  <IconTrash />
                </IconButton>
              </Flex>

              {elements[element as keyof typeof elements].component}

              {
                index < length - 1 && (
                  <Divider />
                )
              }
            </Flex>
          ))
        }

        <Button variant="tertiary" size="large" onClick={() => setIsMenuOpen(!isMenuOpen)} disabled={Object.values(elementsVisibility).every((value) => value) || !canAddElements}>
          <MenuProvider placement="bottom-start" open={isMenuOpen}>
            <MenuTrigger asChild>
              <Flex gap="$space-1" align="center">
                <IconPlus />
                {t('template.form.areas.content.buttons.add')}
              </Flex>
            </MenuTrigger>

            <MenuPopover>
              {
                Object.keys(elements).map((element) => (
                  <MenuItem
                    key={element}
                    disabled={elementsVisibility[element as keyof typeof elements]}
                    onClick={() => setElementVisibility(element as keyof typeof elements, true)}
                  >
                    {t(`template.form.areas.content.elements.${element}`)}
                  </MenuItem>
                ))
              }
            </MenuPopover>
          </MenuProvider>
        </Button>
      </Flex>
    </Flex>
  )
}
