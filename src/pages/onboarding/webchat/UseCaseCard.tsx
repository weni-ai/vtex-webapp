import { useState } from 'react';
import { Flex, Text } from '@vtex/shoreline';

interface UseCaseCardProps {
  title: string;
  description: string;
  isSelected: boolean;
  icon: string;
  type: 'preview' | 'test'
  onClick: () => void;
}

const baseCardStyle: React.CSSProperties = {
  alignItems: 'center',
  height: '100%',
  padding: 'var(--sl-space-3)',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--sl-color-gray-3)',
  borderRadius: 'var(--sl-radius-2)',
  background: 'var(--sl-bg-base)',
  cursor: 'pointer',
  transition: 'border-color 0.15s ease, background-color 0.15s ease',
};

const selectedCardStyle: React.CSSProperties = {
  ...baseCardStyle,
  borderColor: 'var(--sl-color-blue-10)',
  background: 'var(--sl-bg-informational)', 
}; 

const hoveredCardStyle: React.CSSProperties = {
  ...baseCardStyle,
  borderColor: 'var(--sl-color-gray-6)'
};

const inactiveIconFilter = 'grayscale(100%) brightness(500%) contrast(0.2)';

export function UseCaseCard(props: UseCaseCardProps) {
  const { title, description, icon, isSelected, onClick, type } = props;
  const [isHovered, setIsHovered] = useState(false);

  const isTestState = type === 'test';
  const isActive = isSelected || isTestState;
  const textColor = isActive ? '$fg-base' : '$fg-base-soft';
  const titleVariant = !isTestState && !isSelected ? 'emphasis' : 'action';
  const descriptionVariant = !isTestState && !isSelected ? 'caption2' : 'caption1';
  const descriptionColor = !isTestState && isActive ? '$fg-base' : '$fg-base-soft';

  function getCardStyle(): React.CSSProperties {
    if (isSelected) {
      return selectedCardStyle;
    }
    return isHovered ? hoveredCardStyle : baseCardStyle;
  }

  return (
    <Flex
      gap="$space-3"
      style={getCardStyle()}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && onClick()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-pressed={isSelected}
    >
      <img
        src={icon}
        alt={title}
        style={{ filter: isActive ? 'unset' : inactiveIconFilter, transition: 'filter 0.15s ease' }}
      />
      <Flex direction="column" gap="$space-05">
        <Text variant={titleVariant} color={textColor}>
          {title}
        </Text>
        <Text variant={descriptionVariant} color={descriptionColor}>
          {description}
        </Text>
      </Flex>
    </Flex>
  );
}
