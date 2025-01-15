import {
  Alert,
  Divider,
  Flex,
  Grid,
  IconArrowLeft,
  IconButton,
  Page,
  PageContent,
  PageHeader,
  PageHeaderRow,
  PageHeading,
  Text,
} from '@vtex/shoreline';
import { Channel } from './Channel';
import { useNavigate } from 'react-router-dom';
import { LoadingPage } from '../components/LoadingPage';
import { useDispatch, useSelector } from 'react-redux';
import { isWhatsAppIntegrated, loadingWhatsAppIntegration, setLoadingWhatsAppIntegration, whatsAppError } from '../store/userSlice';
import { useEffect } from 'react';

export function Channels() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const setup = useSelector(loadingWhatsAppIntegration)
  const isIntegrated = useSelector(isWhatsAppIntegrated)
  const error = useSelector(whatsAppError)

  useEffect(() => {
    if (setup) {
      const timer = setTimeout(() => {
        dispatch(setLoadingWhatsAppIntegration(false));
        navigate('/dash');
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [setup, dispatch, navigate]);

  function navigateBack() {
    navigate('/agent-builder')
  }

  return (
    <Page>
      {setup ? (
        <>
          <LoadingPage
            title="Setup Complete!"
            description="Congratulations! Your agent is fully configured and ready to assist your customers."
            color="#019213"
          />
        </>
      ) : (
        <>
          <PageHeader>
            <PageHeaderRow
              style={{
                justifyContent: 'start',
                gap: 'var(--sl-space-3)',
              }}
            >
              <IconButton variant="tertiary" label="Actions" onClick={navigateBack}>
                <IconArrowLeft />
              </IconButton>

              <PageHeading>{t('integration.title')}</PageHeading>
            </PageHeaderRow>
          </PageHeader>

          <Divider />

          <PageContent>
            <Flex
              style={{
                marginBottom: 'var(--sl-space-5)',
              }}
            >
              <Text variant="action" color="$fg-base-soft">
                {t('integration.description')}
              </Text>
            </Flex>

            {
              error ? <Alert
                variant="critical"
                style={{
                  marginBlock: 'var(--sl-space-6)',
                }}
              >
                <Text variant="body" color="$fg-base">
                  {t('integration.channels.whatsapp.error')}
                </Text>
              </Alert>
                : null
            }

            <Grid columns="repeat(auto-fill, minmax(20rem, 1fr))">
              <Channel isIntegrated={isIntegrated} />
            </Grid>
          </PageContent>
        </>
      )}
    </Page>
  );
}
