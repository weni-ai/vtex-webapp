import { Divider, Flex, Skeleton } from '@vtex/shoreline';

const SKELETON_ROW_COUNT = 5;

function SkeletonRow() {
  return (
    <Flex align="center" justify="space-between" style={{ padding: 'var(--sl-space-2) var(--sl-space-4)' }}>
      <Flex align="center" gap="$space-4">
        <Flex direction="column" gap="$space-0">
          <Skeleton style={{ width: '120px', height: '20px' }} />
          <Skeleton style={{ width: '100px', height: '16px' }} />
        </Flex>
        <Skeleton style={{ width: '80px', height: '24px', borderRadius: '9999px' }} />
      </Flex>
      <Skeleton style={{ width: '100px', height: '20px' }} />
    </Flex>
  );
}

export function RecentActivitySkeleton() {
  return (
    <Flex direction="column" gap="$space-0">
      {Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
        <Flex direction="column" key={index} gap="$space-0">
          <SkeletonRow />
          {index < SKELETON_ROW_COUNT - 1 && <Divider />}
        </Flex>
      ))}
    </Flex>
  );
}
