
import {
  Button,
  Container,
  Flex,
  IconWarningCircle,
  Page,
  PageContent,
  PageHeader,
  PageHeaderRow,
  PageHeading,
  Text,
} from '@vtex/shoreline';
import { useNavigate } from 'react-router-dom';
export function SetupError() {
  const navigate = useNavigate()
  const navigateToAgent = () => {
    navigate('/agent-builder')
  }
  return (
    <Container>
      <Page style={{ height: '100vh' }}>
        <PageHeader>
          <PageHeaderRow style={{ height: '44px', paddingLeft: '36px' }}>
            <PageHeading >
              New Agent
            </PageHeading>
          </PageHeaderRow>
        </PageHeader>

        <PageContent style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 95px)',
          textAlign: 'center',
        }}>
          <Flex direction='column' style={{ alignItems: 'center' }}>
            <IconWarningCircle color='red' width={'52px'} height={'52px'} />
            <Text variant='display2'>Something went wrong</Text>
            <Text variant='body' color='$fg-base-soft'>Retry or check back later if the issue persists.</Text>
            <Button onClick={navigateToAgent}>Try again</Button>
          </Flex>
        </PageContent>
      </Page>
    </Container>
  );
}
