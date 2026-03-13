import { Divider, Flex } from '@vtex/shoreline';
import { RecentActivityItem } from './RecentActivityItem';
import type { SupervisorConversation } from './constants';

interface RecentActivityListProps {
  conversations: SupervisorConversation[];
}

export function RecentActivityList({ conversations }: RecentActivityListProps) {
  return (
    <Flex direction="column" gap="$space-0">
      {conversations.map((conversation, index) => (
        <Flex direction="column" key={conversation.uuid} gap="$space-0">
          <RecentActivityItem conversation={conversation} />
          {index < conversations.length - 1 && <Divider />}
        </Flex>
      ))}
    </Flex>
  );
}
