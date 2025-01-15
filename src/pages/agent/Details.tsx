
import { Button, Container, Content, Flex, Page, PageContent, PageHeader, PageHeaderRow, PageHeading, Text } from '@vtex/shoreline';
import AgentDemoGif from '../../assets/channels/agentDemoGif';
import Icon from '../../assets/icons/Icon';
import { useNavigate } from 'react-router-dom';

export function AgentDetails() {
    const navigate = useNavigate();
    const navigateToBuilder = () => {
        navigate('/agent-builder')
    }
    return (
        <Container>
            <Page>
                <PageHeader>
                    <PageHeaderRow style={{
                        justifyContent: 'space-between',
                        gap: 'var(--sl-space-3)'
                    }}>
                        <PageHeading>
                            {t('title')}
                        </PageHeading>
                        <Button size='large' variant='primary' onClick={navigateToBuilder}>{t('agent.setup.buttons.create_agent')}</Button>
                    </PageHeaderRow>
                </PageHeader>
 
                <PageContent style={{ maxWidth: '950px' }}>
                    <Content narrow>
                        <Flex style={{ width: '720px', justifyContent: 'space-between', gap: '64px' }}>
                            <Flex direction='column'>
                                <Flex direction='column' style={{
                                    width: '394px',
                                    gap: '8px'
                                }}>
                                    <Text variant='display3'>Intelligent agents</Text>
                                    <Text variant='body' >Enhance intelligent agents by enabling control over conversation flows based on user intentions. Customize language, tone, and behavior to give the agent a unique identity and improve communication quality. See the demonstration of the exchange and return agent interaction on the side.</Text>

                                </Flex>
                                <Flex direction='column'>
                                    <Text variant='display3'>Agent Skills</Text>
                                    <Flex direction='column' style={{ gap: '8px' }}>
                                        <Flex style={{ gap: '8px', alignItems: 'center' }}>
                                            <Icon icon='manage_search' />
                                            <Text variant='body'>Analyze the context</Text>
                                        </Flex>
                                        <Flex style={{ gap: '8px', alignItems: 'center' }}>
                                            <Icon icon='neurology' />
                                            <Text variant='body'>Comprehend complex demands</Text>
                                        </Flex>
                                        <Flex style={{ gap: '8px', alignItems: 'center' }}>
                                            <Icon icon='volunteer_activism' />
                                            <Text variant='body'>Provide customized responses</Text>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            </Flex>
                            <Flex style={{ width: '100%' }}>
                                <AgentDemoGif />
                            </Flex>
                        </Flex>
                    </Content>
                </PageContent>
            </Page>
        </Container>
    )
}
