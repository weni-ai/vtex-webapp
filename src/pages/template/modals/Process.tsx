import { Alert, Button, Flex, IconCheck, Modal, ModalContent, ModalDismiss, ModalFooter, ModalHeader, ModalHeading, Spinner, Text } from "@vtex/shoreline";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";

let stepsLocal: { status: 'completed' | 'loading' | 'pending', description: string }[] = [];

function CompletedStep({ variant, description }: { variant: 'success' | 'critical', description: string }) {
  return (
    <Alert variant={variant} data-testid="alert-completed">
      <Text variant="body">
        <Markdown>{description}</Markdown>
      </Text>
    </Alert>
  )
}

export function ProcessModal({
  open,
  onClose,
  processingText,
  steps: stepsInitial,
  errorText,
  successText,
}: {
  open: boolean;
  onClose: () => void;
  processingText: string;
  steps: string[];
  errorText: string;
  successText: string;
}) {
  const { t } = useTranslation();

  const [page, setPage] = useState<'processing' | 'completed'>('processing');
  const [steps, setSteps] = useState<{ status: 'completed' | 'loading' | 'pending', description: string }[]>([]);

  useEffect(() => {
    if (errorText || successText) {
      finishSteps();
    }

    if (errorText) {
      setPage('completed');
    }
  }, [errorText, successText]);

  function finishSteps() {
    if (nextStepTimeout) {
      clearTimeout(nextStepTimeout);
    }

    stepsLocal = stepsLocal.map(step => ({ ...step, status: 'completed' }));
    setSteps(stepsLocal);
  }

  useEffect(() => {
    if (nextStepTimeout) {
      clearTimeout(nextStepTimeout);
    }

    if (open) {
      setPage('processing');

      stepsLocal = stepsInitial.map((step) => ({
        status: 'pending' as 'completed' | 'loading' | 'pending',
        description: step,
      }));

      setSteps(stepsLocal);

      doNextFakeLoading();
    }
  }, [open]);

  const isFinished = useMemo(() => {
    return steps.every(step => step.status === 'completed');
  }, [steps]);

  const [nextStepTimeout, setNextStepTimeout] = useState<NodeJS.Timeout | null>(null);

  function doNextFakeLoading(status?: 'pending' | 'loading' | 'completed') {
    if (status === undefined) {
      stepsLocal = stepsLocal.map(step => ({ ...step, status: 'pending' }));
      doNextFakeLoading('pending');
    }

    const currentStepIndex = stepsLocal.findIndex(step => step.status === status);

    if (status === 'pending') {
      stepsLocal = stepsLocal.map((step, index) => ({ ...step, status: index === currentStepIndex ? 'loading' : step.status }));

      const lastStepIndex = stepsLocal.length - 1;

      if (currentStepIndex < lastStepIndex) {
        setNextStepTimeout(setTimeout(() => {
          doNextFakeLoading('loading');
        }, 1000));
      }
    }

    if (status === 'loading') {
      stepsLocal = stepsLocal.map((step, index) => ({ ...step, status: index === currentStepIndex ? 'completed' : step.status }));

      setNextStepTimeout(setTimeout(() => {
        doNextFakeLoading('pending');
      }, 0));
    }

    setSteps(stepsLocal);
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalHeader>
        <ModalHeading>{t(`template.modals.create.steps.${page}.title`)}</ModalHeading>
        <ModalDismiss />
      </ModalHeader>

      <ModalContent>
        {page === 'processing' && (
          <Flex direction="column" gap="$space-4">
            <Text variant="body">
              {processingText}
            </Text>

            <Flex direction="column" gap="$space-2">
              {steps.map((step, index) => (
                <Text key={index} variant="action" color={{ completed: '$fg-success', loading: '$fg-base-soft', pending: '$color-gray-5' }[step.status]}>
                  <Flex gap="$space-2" align="center">
                    {step.status === 'completed' && <IconCheck width={16} height={16} data-testid="icon-check" />}
                    {step.status === 'loading' && <Spinner data-testid="icon-spinner" />}
                    {step.status === 'pending' && <Spinner style={{ opacity: 0 }} data-testid="icon-pending" />}

                    {t(`template.modals.create.steps.processing.items.${step.description}`)}
                  </Flex>
                </Text>
              ))}
            </Flex>
          </Flex>
        )}

        
        {page === 'completed' && errorText && <CompletedStep variant="critical" description={errorText} />}
        {page === 'completed' && successText && <CompletedStep variant="success" description={successText} />}
      </ModalContent>

      <ModalFooter>
        {page === 'processing' && (
          <>
            <Button size="large" onClick={onClose} data-testid="button-cancel">
              {t('template.modals.create.buttons.cancel')}
            </Button>

            <Button
              size="large"
              variant="primary"
              onClick={() => setPage('completed')}
              disabled={!isFinished}
              data-testid="button-proceed"
            >
              {t('template.modals.create.buttons.proceed')}
            </Button>
          </>
        )}

        {page === 'completed' && (
          successText ?
            <Button
              size="large"
              variant="primary"
              onClick={() => { onClose(); }}
              data-testid="button-finish"
            >
              {t('template.modals.create.buttons.finish')}
            </Button>
            :
            <>
              <Button size="large" onClick={onClose} data-testid="button-cancel">
                {t('template.modals.create.buttons.cancel')}
              </Button>

              <Button
                size="large"
                variant="primary"
                onClick={() => { onClose(); }}
                data-testid="button-return-and-fix"
              >
                {t('template.modals.create.buttons.return_and_fix')}
              </Button>
            </>
        )}
      </ModalFooter>
    </Modal>
  )
}
