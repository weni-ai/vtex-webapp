import { Center, Divider, Heading, Page, PageContent, PageHeader, PageHeaderRow, PageHeading, Spinner, Text } from '@vtex/shoreline'
import WeniLogo from '../assets/weni-logo.svg'
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../store/userSlice';

export function SettingUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSetName = async () => {
    let userData;
     try {
    const response = await fetch('http://vtex-io.apip.stg.cloud.weni.ai/create_user', {
      method: 'GET',
      credentials: 'include',
    });
  
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
  
    userData = await response.json();
    console.log('Dados do usuário:', userData);
    dispatch(setUser(userData))
    navigate('/agent-builder')
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
  }
  };

  let loggedIn = false
  useEffect(() => {
    if(!loggedIn){
      handleSetName()
    }
    return () => {
      loggedIn = true;
    };

  }, [navigate]);


  return (
    <Page>
      <PageHeader>
        <PageHeaderRow style={{
          justifyContent: 'start',
          gap: 'var(--sl-space-3)'
        }}>
          <img src={WeniLogo} className="d-inline" />

          <PageHeading>
            Weni agentic IA
          </PageHeading>
        </PageHeaderRow>
      </PageHeader>

      <Divider />

      <PageContent>
        <Center style={{
          textAlign: 'center',
          maxWidth: '26rem',
          margin: '0 auto',
        }}>
          <Spinner description="loading" style={{
            marginBottom: 'var(--sl-space-3)'
          }} />

          <Heading variant="display1" style={{
            marginBottom: 'var(--sl-space-3)'
          }}>
            Setting up your App
          </Heading>

          <Text variant="display4">
            Getting everything ready for you! We're finalizing the initial setup to ensure a smooth experience.
          </Text>
        </Center>
      </PageContent>
    </Page>
  )
}
