import {
  Center,
  Divider,
  Flex,
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
import { useCallback, useEffect, useRef } from 'react';
import { useUserSetup } from './setup/useUserSetup';

interface SettingUpProps {
  title: string;
  description: string;
  color: string;
}

export function SettingUp({ title, description, color }: SettingUpProps) {
  const { initializeUser } = useUserSetup();
  const isInitialized = useRef(false);

  const memoizedInitializeUser = useCallback(() => {
    initializeUser();
  }, [initializeUser]);

  useEffect(() => {
    if (!isInitialized.current) {
      memoizedInitializeUser();
      isInitialized.current = true;
    }
  }, [memoizedInitializeUser]);

  return (
    <Page>
      <PageHeader>
        <PageHeaderRow style={{ justifyContent: 'start', gap: 'var(--sl-space-3)' }}>
          <img src={WeniLogo} alt="Weni Logo" className="d-inline" />
          <PageHeading>Weni agentic IA</PageHeading>
        </PageHeaderRow>
      </PageHeader>

      <Divider />

      <PageContent style={{ marginTop: 'var(--sl-space-24)' }}>
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
              color: `${color}`
            }}
          />

          <Heading
            variant="display1"
            style={{
              marginBottom: 'var(--sl-space-3)',
            }}
          >
            {title}
          </Heading>

          <Text variant="display4">{description}</Text>
        </Center>
      </PageContent>
    </Page>
  );
}
