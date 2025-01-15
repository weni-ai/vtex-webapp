import { Flex, Skeleton } from "@vtex/shoreline";

export function AgentBuilderSkeleton() {
    return (
        <Flex direction="column" gap={'24px'}>
            <Flex>
                <Skeleton width={'185px'} height={'24px'} />
            </Flex>
            <Flex direction="row">
                <Flex direction="column" gap={'20px'}>
                    <Skeleton width={'720px'} height={'40px'} />
                    <Skeleton width={'720px'} height={'40px'} />

                    <Skeleton width={'720px'} height={'40px'} />

                    <Skeleton width={'720px'} height={'112px'} />
                </Flex>
            </Flex>
            <Flex direction="column" gap={'24px'}>
                <Skeleton width={'185px'} height={'24px'} />
                <Skeleton width={'720px'} height={'112px'} />
            </Flex>
        </Flex>
    )
}