import {
  Flex,
  Heading,
  IconUser,
  Skeleton,
  Text,
} from '@vtex/shoreline';

interface WhatsAppProfileCardProps {
  title: string;
  displayName: string | null;
  displayPhoneNumber: string | null;
  photoUrl?: string | null;
  isLoading: boolean;
  editAction: React.ReactNode;
}

const cardStyle: React.CSSProperties = {
  border: 'var(--sl-border-base)',
  borderRadius: 'var(--sl-radius-2)',
  padding: '16px',
};

const avatarStyle: React.CSSProperties = {
  width: 50,
  height: 50,
  flexShrink: 0,
  borderRadius: '50%',
  border: 'var(--sl-border-base)',
  overflow: 'hidden',
  background: 'var(--sl-color-gray-1)',
};

export function WhatsAppProfileCard({
  title,
  displayName,
  displayPhoneNumber,
  photoUrl,
  isLoading,
  editAction,
}: WhatsAppProfileCardProps) {
  return (
    <Flex direction="column" gap="$space-4">
      <Heading variant="display3">{title}</Heading>

      <Flex gap="$space-4" align="center" style={cardStyle}>
        {isLoading ? (
          <>
            <Skeleton style={{ width: 50, height: 50, borderRadius: '50%' }} />
            <Flex direction="column" gap="$space-2" style={{ flex: 1 }}>
              <Skeleton style={{ height: 20, width: '40%' }} />
              <Skeleton style={{ height: 20, width: '60%' }} />
            </Flex>
          </>
        ) : (
          <>
            <Flex gap="$space-4" align="center" style={{ flex: '1 1 0', minWidth: 0 }}>
              <Flex align="center" justify="center" style={avatarStyle}>
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="WhatsApp profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <IconUser />
                )}
              </Flex>

              <Flex direction="column" gap="$space-1">
                <Text variant="emphasis" color="$fg-base">
                  {displayName ?? '—'}
                </Text>
                <Text variant="body" color="$fg-base-soft">
                  {displayPhoneNumber ?? '—'}
                </Text>
              </Flex>
            </Flex>

            {editAction}
          </>
        )}
      </Flex>
    </Flex>
  );
}
