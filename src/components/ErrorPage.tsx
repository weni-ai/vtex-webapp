import {
    Button,
    Center,
    Divider,
    Heading,
    IconWarningCircle,
    Page,
    PageContent,
    PageHeader,
    PageHeaderRow,
    PageHeading,
    Text,
} from '@vtex/shoreline';
import WeniLogo from '../assets/weni-logo.svg';
import { useNavigate } from 'react-router-dom';
interface ErrorProps {
    title: string;
    description: string;
    color: string;
}

export function ErrorPage({ title, description, color }: ErrorProps) {
    const navigate = useNavigate();
    function navigateToDash(){
        navigate('/')
    }
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
                    <IconWarningCircle height="52px"
                        width="52px"
                        display="inline"
                        style={{
                            display: 'inline-block',
                            verticalAlign: 'middle',
                            marginLeft: 'var(--sl-space-05)',
                            color: `${color}`
                        }} />

                    <Heading
                        variant="display1"
                        style={{
                            marginBottom: 'var(--sl-space-3)',
                        }}
                    >
                        {title}
                    </Heading>

                    <Text variant="display4">{description}</Text>
                    <Button  style={{
                        margin: '1rem',
                    }} onClick={navigateToDash}>Try again</Button>
                </Center>
            </PageContent>
        </Page>
    );
}
