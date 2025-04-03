import { Flex, Skeleton } from "@vtex/shoreline";

export function AgentBuilderSkeleton() {
    return (
        <Flex direction="column" gap={'24px'} data-testid="agent-builder-skeleton">
            <Flex direction="row" data-testid="agent-builder-skeleton-row">
                <Flex direction="column" gap={'20px'}>
                    <Skeleton width={'720px'} height={'40px'} />
                    <Skeleton width={'720px'} height={'40px'} />

                    <Skeleton width={'720px'} height={'40px'} />

                    <Skeleton width={'720px'} height={'112px'} />
                </Flex>
            </Flex>
            <Flex direction="column" gap={'24px'} data-testid="agent-builder-skeleton-column">
                <Skeleton width={'185px'} height={'24px'} />
                <Skeleton width={'720px'} height={'112px'} />
            </Flex>
        </Flex>
    )
}