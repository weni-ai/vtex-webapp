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
interface LoadingProps {
    title: string;
    description: string;
    color: string;
}

export function LoadingPage({ title, description, color }: LoadingProps) {
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
