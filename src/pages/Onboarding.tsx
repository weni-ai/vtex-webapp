import { Bleed, Button, Flex, IconArrowLeft, IconButton, Page, PageContent, PageHeader, PageHeaderRow, PageHeading, Stack } from "@vtex/shoreline";
import { AgentsList } from "../components/agent/AgentsList";

export function Onboarding() {
  return (
    <Page>
      <PageHeader>
        <PageHeaderRow>
          <Flex align="center">
            {/* <Bleed top="$space-2" bottom="$space-2">
              <IconButton
                label={t('common.return')}
                asChild
                variant="tertiary"
                size="large"
              >
                <IconArrowLeft />
              </IconButton>
            </Bleed> */}

            <PageHeading>Assign the first agent into your team</PageHeading>
            {/* <PageHeading>Setup Manager profile</PageHeading> */}
          </Flex>

          <Stack space="$space-3" horizontal>
            <Bleed top="$space-2" bottom="$space-2">
              <Button variant="primary" size="large">
                Skip
              </Button>

              {/* <Button variant="primary" size="large">
                Finish
              </Button> */}
            </Bleed>
          </Stack>
        </PageHeaderRow>
      </PageHeader>

      <PageContent>
        <AgentsList onAssign={() => { }} />
      </PageContent>
    </Page>
  );
}
