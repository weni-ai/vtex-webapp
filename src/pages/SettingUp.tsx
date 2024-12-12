import {
  Center,
  Divider,
  Heading,
  Page,
  PageContent,
  PageHeader,
  PageHeaderRow,
  PageHeading,
  Spinner,
  Text,
} from '@vtex/shoreline';
import WeniLogo from '../assets/weni-logo.svg';
import { useEffect, useRef } from 'react';
import { useUserSetup } from './setup/useUserSetup';

export function SettingUp() {
  const { initializeUser } = useUserSetup();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
    const payload = {}
      initializeUser(payload);
      isInitialized.current = true;
    }
  }, [initializeUser]);

  return (
    <Page>
      <PageHeader>
        <PageHeaderRow style={{ justifyContent: 'start', gap: 'var(--sl-space-3)' }}>
          <img src={WeniLogo} alt="Weni Logo" className="d-inline" />
          <PageHeading>Weni agentic IA</PageHeading>
        </PageHeaderRow>
      </PageHeader>

      <Divider />

      <PageContent>
        <Center
          style={{
            textAlign: 'center',
            maxWidth: '26rem',
            margin: '0 auto',
          }}
        >
          <Spinner
            description="loading"
            style={{
              marginBottom: 'var(--sl-space-3)',
            }}
          />

          <Heading
            variant="display1"
            style={{
              marginBottom: 'var(--sl-space-3)',
            }}
          >
            Setting up your App
          </Heading>

          <Text variant="display4">
            Getting everything ready for you! We're finalizing the initial setup to ensure a smooth
            experience.
          </Text>
        </Center>
      </PageContent>
    </Page>
  );
}
