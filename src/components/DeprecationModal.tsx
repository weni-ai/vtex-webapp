import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalHeading,
  Text,
} from '@vtex/shoreline';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/userSlice';

export function DeprecationModal() {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const account = user?.account;

  function handleGoToDashboard() {
    window.open(`https://${account}.myvtex.com/admin/agentic-cx`, '_blank');
  }

  if (!account) {
    return null;
  }

  return (
    <Modal open onClose={() => {}}>
      <ModalHeader>
        <ModalHeading>{t('deprecation_modal.title')}</ModalHeading>
      </ModalHeader>

      <ModalContent>
        <Text variant="body">
          <Trans
            i18nKey="deprecation_modal.description"
            components={[<strong />]}
          />
        </Text>

        <Text variant="body">
          {t('deprecation_modal.discontinuation_notice')}
        </Text>
      </ModalContent>

      <ModalFooter>
        <Button variant="primary" size="large" onClick={handleGoToDashboard}>
          {t('deprecation_modal.go_to_dashboard')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
