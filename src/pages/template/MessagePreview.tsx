import { Flex, Text } from "@vtex/shoreline";
import { IconWhatsappOpenInNewTab } from "../../assets/icons/WhatsappOpenInNewTab";

export function MessagePreview({ header, contentText, footer, buttonText }: {
  header?: { type: 'text', text: string } | { type: 'media', file?: File, previewSrc?: string };
  contentText: string;
  footer?: string;
  buttonText?: string;
}) {
  return (
    <Flex direction="column" gap="$space-4" align="center" justify="center" style={{ padding: 'var(--sl-space-8)', borderRadius: 'var(--sl-radius-2)', backgroundColor: '#DBE9FD', }}>
      <Flex direction="column" gap="$space-1" style={{ backgroundColor: 'var(--sl-color-gray-0)', padding: 'var(--sl-space-2)', borderRadius: '0 5.35px 5.35px 5.35px', boxShadow: '0px 4px 8px 0px #0000001A', width: '250px', }}>
        {header && header.type === 'text' && (
          <Flex align="center" style={{ padding: '2.67px 5.35px', }}>
            <Text variant="caption1" color="$fg-base" style={{ wordBreak: 'break-word', }}>{header.text}</Text>
          </Flex>
        )}

        {header && header.type === 'media' && (
          <Flex align="center" justify="space-between" style={{ borderRadius: 'var(--sl-radius-1)', height: '121px', backgroundColor: '#D9D9D9', marginBottom: 'var(--sl-space-1)', backgroundImage: header.previewSrc ? `url(${header.previewSrc})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', }}>
          </Flex>
        )}

        <Flex align="center" style={{ padding: '2.67px 5.35px', }}>
          <Text variant="caption2" color="$fg-base" style={{ wordBreak: 'break-word', }}>{contentText}</Text>
        </Flex>

        <Flex align="center" justify="space-between" style={{ paddingInline: '5.35px', }}>
          <Text variant="caption2" color="$fg-base-soft">{footer}</Text>

          <Text variant="caption2" color="$fg-base-soft">6:16 PM</Text>
        </Flex>

        {buttonText !== undefined && (
          <Flex direction="column" align="center" justify="space-between" style={{ marginTop: '7px', paddingTop: 'var(--sl-space-2)', borderTop: '1px solid #E2E6ED', }}>
            <Text variant="caption1" color="$fg-accent">
              <Flex align="center" gap="$space-1">
                <IconWhatsappOpenInNewTab />

                {buttonText}
              </Flex>
            </Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}
