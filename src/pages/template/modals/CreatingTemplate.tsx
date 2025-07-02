import { Alert, Button, Flex, IconCheck, Modal, ModalContent, ModalDismiss, ModalFooter, ModalHeader, ModalHeading, Spinner, Text } from "@vtex/shoreline";
import { useEffect, useMemo, useState } from "react";
import Markdown from "react-markdown";

let stepsLocal: { status: 'completed' | 'loading' | 'pending', description: string }[] = [{
  status: 'completed',
  description: 'analyzing_defined_requirements',
}, {
  status: 'loading',
  description: 'reviewing_template_structure',
}, {
  status: 'pending',
  description: 'validating_inserted_content',
}, {
  status: 'pending',
  description: 'adjusting_custom_variables',
}, {
  status: 'pending',
  description: 'optimizing_template_for_fast_delivery',
}, {
  status: 'pending',
  description: 'performing_final_security_checks',
}];

function ProcessingStep({ steps }: { steps: { status: 'completed' | 'loading' | 'pending', description: string }[] }) {
  return (
    <Flex direction="column" gap="$space-4">
      <Text variant="body">
        {t('template.modals.create.steps.processing.description')}
      </Text>

      <Flex direction="column" gap="$space-2">
        {steps.map((step, index) => (
          <Text key={index} variant="action" color={{ completed: '$fg-success', loading: '$fg-base-soft', pending: '$color-gray-5' }[step.status]}>
            <Flex gap="$space-2" align="center">
              {step.status === 'completed' && <IconCheck width={16} height={16} />}
              {step.status === 'loading' && <Spinner />}
              {step.status === 'pending' && <Spinner style={{ opacity: 0 }} />}

              {t(`template.modals.create.steps.processing.items.${step.description}`)}
            </Flex>
          </Text>
        ))}
      </Flex>
    </Flex>
  );
}

function CompletedStep({ variant, description }: { variant: 'success' | 'critical', description: string }) {
  return (
    <Alert variant={variant}>
      <Text variant="body">
        <Markdown>{description}</Markdown>
      </Text>
    </Alert>
  )
}

export function CreatingTemplateModal({ open, onClose, errorText, successText }: { open: boolean; onClose: () => void, errorText: string, successText: string }) {
  const [page, setPage] = useState<'processing' | 'completed'>('processing');
  const [steps, setSteps] = useState<{ status: 'completed' | 'loading' | 'pending', description: string }[]>(stepsLocal);

  const isFinished = useMemo(() => {
    return steps.every(step => step.status === 'completed');
  }, [steps]);
  const [nextStepTimeout, setNextStepTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (nextStepTimeout) {
      clearTimeout(nextStepTimeout);
    }

    if (open) {
      setPage('processing');
      doNextFakeLoading();
    }
  }, [open]);

  useEffect(() => {
    if (errorText || successText) {
      finishSteps();
    }

    if (errorText) {
      setPage('completed');
    }
  }, [errorText, successText]);

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

  function finishSteps() {
    if (nextStepTimeout) {
      clearTimeout(nextStepTimeout);
    }

    stepsLocal = stepsLocal.map(step => ({ ...step, status: 'completed' }));
    setSteps(stepsLocal);
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalHeader>
        <ModalHeading>{t(`template.modals.create.steps.${page}.title`)}</ModalHeading>
        <ModalDismiss />
      </ModalHeader>

      <ModalContent>
        {page === 'processing' && <ProcessingStep steps={steps} />}

        {page === 'completed' && errorText && <CompletedStep variant="critical" description={errorText} />}
        {page === 'completed' && successText && <CompletedStep variant="success" description={successText} />}
      </ModalContent>

      <ModalFooter>
        {page === 'processing' && (
          <>
            <Button size="large" onClick={onClose}>
              {t('template.modals.create.buttons.cancel')}
            </Button>

            <Button
              size="large"
              variant="primary"
              onClick={() => setPage('completed')}
              disabled={!isFinished}
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
            >
              {t('template.modals.create.buttons.finish')}
            </Button>
            :
            <>
              <Button size="large" onClick={onClose}>
                {t('template.modals.create.buttons.cancel')}
              </Button>

              <Button
                size="large"
                variant="primary"
                onClick={() => { onClose(); }}
              >
                {t('template.modals.create.buttons.return_and_fix')}
              </Button>
            </>
        )}
      </ModalFooter>
    </Modal>
  )
}
