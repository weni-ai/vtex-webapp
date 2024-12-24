import {
  Alert,
  Divider,
  Flex,
  Grid,
  IconArrowLeft,
  IconArrowRight,
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
import { SettingUp } from '../SettingUp';
import { useState } from 'react';

export function Channels() {
  const navigate = useNavigate();
  const [setup, setSetup] = useState(false);

  function navigateToDash() {
   navigate('/dash')
  }
  function setWhatsAppUser(){
    console.log('setando o zap...')
    setSetup(true);

    setTimeout(() => {
      navigate('/dash');
    }, 5000);
  }

  return (
    <Page>
      {!setup ? (
        <>
          <PageHeader>
            <PageHeaderRow
              style={{
                justifyContent: 'start',
                gap: 'var(--sl-space-3)',
              }}
            >
              <IconButton variant="tertiary" label="Actions" onClick={navigateToDash}>
                <IconArrowLeft />
              </IconButton>
              <IconButton variant="tertiary" label="Actions" onClick={setWhatsAppUser}>
                <IconArrowRight />
              </IconButton>

              <PageHeading>Integrate a support channel</PageHeading>
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
                Choose the channel you want to use and follow the step by step to add it.
              </Text>
            </Flex>

            <Alert
              variant="critical"
              style={{
                marginBlock: 'var(--sl-space-6)',
              }}
            >
              <Text variant="body" color="$fg-base">
                WhatApp unable to connect, check your credentials or try again later.
              </Text>
            </Alert>

            <Grid columns="repeat(auto-fill, minmax(20rem, 1fr))">
              <Channel isIntegrated={false} />
              <Channel isIntegrated={true} />
            </Grid>
          </PageContent>
        </>
      ) : (
        <SettingUp
          title="Setup Complete!"
          description="Congratulations! Your agent is fully configured and ready to assist your customers."
          color="#019213"
        />
      )}
    </Page>
  );
}
