
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
                                    <Text variant='display3'>{t('agent.details.title')}</Text>
                                    <Text variant='body' >{t('agent.details.description')}</Text>

                                </Flex>
                                <Flex direction='column'>
                                    <Text variant='display3'>{t('agent.details.skills.title')}</Text>
                                    <Flex direction='column' style={{ gap: '8px' }}>
                                        <Flex style={{ gap: '8px', alignItems: 'center' }}>
                                            <Flex style={{width: '24px'}}>
                                                <Icon icon='manage_search' />
                                            </Flex>
                                            <Text variant='body'>{t('agent.details.skills.analyze')}</Text>
                                        </Flex>
                                        <Flex style={{ gap: '8px', alignItems: 'center' }}>
                                        <Flex style={{width: '24px', justifyContent: 'center'}}>
                                                <Icon icon='neurology' />
                                            </Flex>
                                            <Text variant='body'>{t('agent.details.skills.comprehend')}</Text>
                                        </Flex>
                                        <Flex style={{ gap: '8px', alignItems: 'center' }}>
                                        <Flex style={{width: '24px'}}>
                                                <Icon icon='volunteer_activism' />
                                            </Flex>
                                            <Text variant='body'>{t('agent.details.skills.provide')}</Text>
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
