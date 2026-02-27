import { useState } from "react";
import { Flex, Heading, Text, IconCheck, Tag } from "@vtex/shoreline";
import { useTranslation } from "react-i18next";

export interface ChannelCardProps {
  title: string;
  description: string;
  benefits: string[];
  footer: string;
  isRecommended?: boolean;
  onClick: () => void;
}

function getCardStyle(isRecommended: boolean, isHovered: boolean): React.CSSProperties {
  const base: React.CSSProperties = {
    padding: "var(--sl-space-5)",
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: "var(--sl-radius-2)",
    cursor: "pointer",
    boxShadow: "var(--sl-shadow-1)",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  };

  if (isRecommended) {
    return {
      ...base,
      borderColor: isHovered
        ? "var(--sl-color-blue-11)"
        : "var(--sl-color-blue-10)",
      background: "var(--sl-bg-informational)",
    };
  }

  return {
    ...base,
    borderColor: isHovered
      ? "var(--sl-color-gray-6)"
      : "var(--sl-color-gray-3)",
    background: "var(--sl-bg-base)",
  };
}

export function ChannelCard(props: ChannelCardProps) {
  const { title, description, benefits, footer, isRecommended, onClick } = props;
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Flex
      direction="column"
      gap="$space-4"
      style={getCardStyle(!!isRecommended, isHovered)}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e: React.KeyboardEvent) => e.key === "Enter" && onClick()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Flex direction="column" align="flex-start" gap="$space-2" style={{ alignSelf: "stretch" }}>
        <Flex align="center" justify="space-between" style={{ alignSelf: "stretch" }}>
          <Heading variant="display3">{title}</Heading>
          {isRecommended && (
            <Tag color="blue" style={{ border: "unset" }}>{t("onboarding.channel_selection.recommended")}</Tag>
          )}
        </Flex>
        <Text variant="caption2" color="$fg-base-soft">{description}</Text>
      </Flex>

      <Flex direction="column" gap="$space-2">
        {benefits.map((benefit, index) => (
          <Flex key={index} align="center" gap="$space-1">
            <IconCheck
              height={16}
              width={16}
              style={{ flexShrink: 0, color: "var(--sl-color-green-7)" }}
            />
            <Text variant="body">{benefit}</Text>
          </Flex>
        ))}
      </Flex>

      <Text variant="caption2" color="$fg-base-soft" style={{ marginTop: "auto" }}>
        {footer}
      </Text>
    </Flex>
  );
}
