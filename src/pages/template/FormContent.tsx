import { Alert, Bleed, Button, Divider, Field, FieldDescription, FieldError, Flex, IconButton, IconPencil, IconPlus, IconTrash, IconX, Input, Label, MenuItem, MenuPopover, MenuProvider, MenuSeparator, MenuTrigger, Radio, RadioGroup, Text, Textarea, useRadioState, VisuallyHidden } from "@vtex/shoreline";
import { SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { cleanURL } from "../../utils";
import { Content, SectionHeader } from "./Template";
import { calculateCursorPosition, TextareaClone } from "./TextareaClone";

async function fileToBase64(file: File) {
  try {
    return new Promise((resolve: (result: string) => void, reject: (error: Error) => void) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error as unknown as Error);
      };
      reader.readAsDataURL(file);
    });
  } catch (error) {
    throw error;
  }
}

export function FormContent({ status, content, setContent, prefilledContent, canChangeButton = true, isHeaderEditable = true, isFooterEditable = true, isButtonEditable = true, totalVariables, addEmptyVariables, openNewVariableModal, variables, contentError, canCreateVariable }: {
  status: 'active' | 'pending' | 'rejected' | 'needs-editing',
  content: Content,
  setContent: React.Dispatch<SetStateAction<Content>>,
  prefilledContent: Content,
  isHeaderEditable?: boolean;
  isFooterEditable?: boolean;
  isButtonEditable?: boolean;
  canChangeButton?: boolean;
  totalVariables: number;
  addEmptyVariables: (count: number) => void;
  openNewVariableModal: (text: string) => void;
  variables: string[];
  contentError?: string;
  canCreateVariable: boolean;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [headerType, setHeaderType] = useState<'text' | 'media'>('text');
  const headerTypeState = useRadioState({
    value: headerType,
    setValue: setHeaderType as any,
  });

  const [buttonType, setButtonType] = useState<'dynamic' | 'static'>('static');
  const buttonTypeState = useRadioState({
    value: buttonType,
    setValue: setButtonType as any,
  });

  const contentTextRef = useRef<HTMLTextAreaElement>(null);
  const contentTextCloneRef = useRef<HTMLDivElement>(null);
  const [cursorPosition, setCursorPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [shouldSuggestNewVariable, setShouldSuggestNewVariable] = useState(false);
  const [temporaryContentText, setTemporaryContentText] = useState('');

  const [headerText, setHeaderText] = useState('');
  const [contentText, setContentText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonUrl, setButtonUrl] = useState('');
  const [buttonUrlExample, setButtonUrlExample] = useState('');

  function adjustContentTextHeight() {
    if (contentTextRef.current) {
      const borderWidth = 1;
      contentTextRef.current.style.height = 'auto';
      contentTextRef.current.style.height = contentTextRef.current.scrollHeight + (borderWidth * 2) + 'px';
    }
  }

  function calculateIfShouldSuggestAVariable() {
    if (contentTextRef.current && contentTextCloneRef.current) {
      const { x, y } = calculateCursorPosition(contentTextRef.current, contentTextCloneRef.current, contentText);
      setCursorPosition({ x, y });

      const isBegginingAVariable = contentText.slice(0, contentTextRef.current.selectionStart).endsWith('{{');
      const isThereANumberAfterVariable = contentText.slice(contentTextRef.current.selectionStart).match(/^\d/);

      setShouldSuggestNewVariable(isBegginingAVariable && !isThereANumberAfterVariable);
      setTemporaryContentText(contentText.slice(0, contentTextRef.current.selectionStart) + 'toBeReplaced' + contentText.slice(contentTextRef.current.selectionStart));
    }
  }

  useEffect(() => {
    adjustContentTextHeight();
    calculateIfShouldSuggestAVariable();
  }, [contentText]);

  function handleContentTextChange(value: string) {
    if (!canCreateVariable) {
      setContentText(value);
      return;
    }

    let newContentText = value;
    let lastVariableNumber = totalVariables;

    newContentText = newContentText.replace(/{{(\d+)}}/g, (_, number) => {
      if (Number(number) > lastVariableNumber) {
        lastVariableNumber += 1;
        return `{{${lastVariableNumber}}}`;
      }

      return `{{${number}}}`;
    });

    addEmptyVariables(lastVariableNumber - totalVariables);
    setContentText(newContentText);

    if (contentTextRef.current) {
      const selectionStart = contentTextRef.current.selectionStart;

      setTimeout(() => {
        if (contentTextRef.current) {
          contentTextRef.current.selectionStart = contentTextRef.current.selectionEnd = selectionStart;
        }
      }, 0);
    }
  }

  const [file, setFile] = useState<File | undefined>(undefined);
  const [filePreview, setFilePreview] = useState<string | undefined>(undefined);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (file) {
      setFile(file);
      setFilePreview(await fileToBase64(file));
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
    const button = { text: buttonText, url: buttonUrl, urlExample: buttonType === 'dynamic' ? buttonUrlExample : undefined };

    setContent({
      ...content,
      header: elementsVisibility.header ? header : undefined,
      content: contentText || ' ',
      footer: elementsVisibility.footer ? footerText : undefined,
      button: elementsVisibility.button ? button : undefined,
    });
  }, [elementsVisibility, headerType, headerText, filePreview, contentText, footerText, buttonText, buttonUrl, buttonType, buttonUrlExample]);

  useEffect(() => {
    const initialVisibility = {
      header: false,
      footer: false,
      button: false,
    };

    if (prefilledContent.header?.type === 'text') {
      setHeaderType('text');
      setHeaderText(prefilledContent.header.text);
      initialVisibility.header = true;
    } else if (prefilledContent.header?.type === 'media') {
      setHeaderType('media');
      setFile(prefilledContent.header.file);
      setFilePreview(prefilledContent.header.previewSrc);
      initialVisibility.header = true;
    }

    if (prefilledContent.content) {
      setContentText(prefilledContent.content);
    }

    if (prefilledContent.button) {
      setButtonType(prefilledContent.button.urlExample ? 'dynamic' : 'static');
      setButtonText(prefilledContent.button.text);
      setButtonUrl(cleanURL(prefilledContent.button.url));
      setButtonUrlExample(cleanURL(prefilledContent.button.urlExample || ''));
      initialVisibility.button = true;
    }

    if (prefilledContent.footer) {
      setFooterText(prefilledContent.footer);
      initialVisibility.footer = true;
    }

    setElementsVisibility(initialVisibility);
  }, [prefilledContent]);

  const isElementsEditable = useMemo(() => {
    return {
      header: isHeaderEditable,
      footer: isFooterEditable,
      button: isButtonEditable,
    };
  }, [isHeaderEditable, isFooterEditable, isButtonEditable]);

  const canRemoveElements = useMemo(() => {
    return {
      header: status !== 'needs-editing',
      footer: status !== 'needs-editing',
      button: status !== 'needs-editing',
    };
  }, [status]);

  function treatFileName(fileName: string, maxFileNameLength = 52) {
    const [removedQueryParams] = fileName.split('?');
    const extension = removedQueryParams.includes('.') ? removedQueryParams.split('.').pop() as string : '';
    const nameWithoutExtension = extension.length > 0 ? removedQueryParams.slice(0, -extension.length - 1) : removedQueryParams;

    let treatedFileName = extension.length > 0 ? `${nameWithoutExtension}.${extension}` : nameWithoutExtension;

    if (treatedFileName.length > maxFileNameLength) {
      const suffix = `...${extension}`;

      treatedFileName = `${treatedFileName.slice(0, maxFileNameLength - suffix.length)}${suffix}`;
    }

    return treatedFileName;
  }

  const elements = {
    header: {
      isVisible: false,
      component: (
        <>
          <Bleed top="$space-7">
            <RadioGroup label="" horizontal state={headerTypeState}>
              <Radio value="text" disabled={status === 'needs-editing'}>{t('template.form.fields.content.header.radio.text.label')}</Radio>
              <Radio value="media" disabled={status === 'needs-editing'}>{t('template.form.fields.content.header.radio.media.label')}</Radio>
            </RadioGroup>
          </Bleed>

          {headerType === 'text' && (
            <Field>
              <Label>{t('template.form.fields.content.header.label')}</Label>

              <Input value={headerText} onChange={setHeaderText} disabled={status === 'needs-editing'} />
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
                      wordBreak: 'break-word',
                      textDecoration: 'underline',
                    }}
                  >
                    {treatFileName(file.name)}
                  </Text>

                  <IconButton variant="secondary" label={t('template.form.areas.content.header.media.buttons.remove')} onClick={() => { setFile(undefined); setFilePreview(undefined); }} disabled={status === 'needs-editing'}>
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
                <input id="file-input" type="file" onChange={handleFileChange} accept="image/*" />
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

          <Input value={footerText} onChange={setFooterText} disabled={status === 'needs-editing'} />
        </Field>
      ),
    },

    button: {
      isVisible: false,
      component: (
        <>
          {false && (<Bleed top="$space-7">
            <RadioGroup label="" horizontal state={buttonTypeState}>
              <Radio value="dynamic" disabled={status !== 'needs-editing' && !canChangeButton}>{t('template.form.fields.content.button.radio.dynamic.label')}</Radio>
              <Radio value="static" disabled={status !== 'needs-editing' && !canChangeButton}>{t('template.form.fields.content.button.radio.static.label')}</Radio>
            </RadioGroup>
          </Bleed>)}

          <Field>
            <Label>{t('template.form.fields.content.button.text.label')}</Label>

            <Input value={buttonText} onChange={setButtonText} disabled={!canChangeButton || status === 'needs-editing'} />
          </Field>

          <Field>
            <Label>{t('template.form.fields.content.button.url.label')}</Label>

            <Input
              prefix="https://"
              value={buttonUrl}
              onChange={(value) => setButtonUrl(cleanURL(value))}
              disabled={status !== 'needs-editing' && !canChangeButton}
              suffix={buttonType === 'dynamic' ? "{{1}}" : undefined}
            />
          </Field>

          {buttonType === 'dynamic' && (
            <Field>
              <Label>{t('template.form.fields.content.button.url_example.label')}</Label>

              <Input prefix="https://" value={buttonUrlExample} onChange={(value) => setButtonUrlExample(cleanURL(value))} disabled={status !== 'needs-editing' && !canChangeButton} />

              <FieldDescription>{t('template.form.fields.content.button.url_example.description')}</FieldDescription>
            </Field>
          )}
        </>
      ),
    }
  }

  function isElementDisabled(element: keyof typeof elements) {
    return elementsVisibility[element] || !isElementsEditable[element];
  }

  const elementsNotDisabled = useMemo(() => {
    return (Object.keys(elements) as Array<keyof typeof elements>)
      .filter((element) => !isElementDisabled(element));
  }, [elements, elementsVisibility, isElementsEditable]);

  function setElementVisibility(element: keyof typeof elements, isVisible: boolean) {
    setElementsVisibility({
      ...elementsVisibility,
      [element]: isVisible,
    });
  }

  return (
    <Flex direction="column" gap="$space-4">
      <SectionHeader title={t('template.form.areas.content.title')} />

      <Field error={!!contentError}>
        <Label>{t('template.form.fields.content.label')}</Label>

        <Flex style={{ position: 'relative' }}>
          <TextareaClone ref={contentTextCloneRef} />

          <Textarea
            className="content-textarea-full-width"
            value={contentText}
            onChange={handleContentTextChange}
            disabled={status === 'needs-editing'}
            ref={contentTextRef}
            onKeyUp={calculateIfShouldSuggestAVariable}
          />

          <MenuProvider
            placement="bottom-start"
            open={shouldSuggestNewVariable}
            setOpen={setShouldSuggestNewVariable}
          >
            <MenuTrigger asChild>
              <Flex style={{ position: 'absolute', top: cursorPosition.y + 20, left: cursorPosition.x }}></Flex>
            </MenuTrigger>

            <MenuPopover>
              {variables.map((variable, index) => (
                <MenuItem key={index} onClick={() => {
                  setContentText(temporaryContentText.replace(/{{toBeReplaced(}})?/, `{{${index + 1}}}`));
                }}>
                  {canCreateVariable ? `{{${index + 1}}} ${variable}` : variable}
                </MenuItem>
              ))}

              {variables.length > 0 && canCreateVariable && <MenuSeparator />}

              {canCreateVariable && (
                <MenuItem onClick={() => { openNewVariableModal(temporaryContentText) }}>
                  <IconPencil />
                  {t('template.form.areas.variables.buttons.add')}
                </MenuItem>
              )}
            </MenuPopover>
          </MenuProvider>
        </Flex>

        {contentError ? (
          <FieldError>{contentError}</FieldError>
        ) : (
          canCreateVariable && <FieldDescription>{t('template.form.fields.content.description')}</FieldDescription>
        )}
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
          (Object.keys(elements) as Array<keyof typeof elements>).filter((element) => elementsVisibility[element]).map((element, index, { length }) => (
            <Flex direction="column" gap="$space-4" key={`element-${index}`}>
              <Flex align="center" gap="$space-2" justify="space-between">
                <Text variant="emphasis" color="$fg-base">{t(`template.form.fields.content.${element}.title`)}</Text>

                <IconButton
                  variant="tertiary"
                  label={t('template.form.areas.content.buttons.remove')}
                  onClick={() => setElementVisibility(element, false)}
                  disabled={!canRemoveElements[element]}
                >
                  <IconTrash />
                </IconButton>
              </Flex>

              {elements[element].component}

              {index < length - 1 && (
                <Divider />
              )}
            </Flex>
          ))
        }

        <Button
          variant="tertiary"
          size="large"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          disabled={status === 'needs-editing' || (elementsNotDisabled.every((element) => elementsVisibility[element]) || !(isHeaderEditable || isFooterEditable || isButtonEditable))}
        >
          <MenuProvider
            placement="bottom-start"
            open={isMenuOpen}
            setOpen={setIsMenuOpen}
          >
            <MenuTrigger asChild>
              <Flex gap="$space-1" align="center">
                <IconPlus />
                {t('template.form.areas.content.buttons.add')}
              </Flex>
            </MenuTrigger>

            <MenuPopover>
              {
                (Object.keys(elements) as Array<keyof typeof elements>).map((element) => (
                  <MenuItem
                    key={element}
                    disabled={isElementDisabled(element)}
                    onClick={() => setElementVisibility(element, true)}
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
