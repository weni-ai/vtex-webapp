import { Tag } from "@vtex/shoreline";
import { useTranslation } from "react-i18next";
export interface TagTypeProps {
  type: 'active' | 'passive';
}

export function TagType({ type }: TagTypeProps) {
  const { t } = useTranslation();

  const color = {
    active: 'blue' as const,
    passive: 'purple' as const,
  }[type];

  return (
    <Tag
      data-testid="tag-type"
      color={color}
      variant="secondary"
      style={{
        borderWidth: 0,
      }}
    >
      {t(`agents.categories.${type}.title`)}
    </Tag>
  )
}