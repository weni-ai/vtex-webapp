import { Tag } from "@vtex/shoreline";

export interface TagTypeProps {
    type: 'active' | 'passive';
}

export function TagType({ type }: TagTypeProps) {
    const color = {
        active: 'blue' as const,
        passive: 'purple' as const,
    }[type];

    return (
      <Tag
        color={color}
        variant="secondary"
      >
        {t(`agents.categories.${type}.title`)}
      </Tag>
    )
}