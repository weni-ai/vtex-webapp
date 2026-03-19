import { useCallback } from 'react';
import { Clickable, Flex } from '@vtex/shoreline';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  loading?: boolean;
}

const TRACK_STYLE: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '38px',
  height: '20px',
  borderRadius: '600px',
  padding: '0 4px',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  border: 'none',
  outline: 'none',
  flexShrink: 0,
};

const DOT_STYLE: React.CSSProperties = {
  width: '14px',
  height: '14px',
  borderRadius: '600px',
  backgroundColor: 'var(--bg-base, white)',
  transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  flexShrink: 0,
};

export function Toggle({ checked, onChange, disabled = false, loading = false }: ToggleProps) {
  const isDisabled = disabled || loading;

  const handleClick = useCallback(() => {
    if (!isDisabled) {
      onChange(!checked);
    }
  }, [isDisabled, checked, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
      e.preventDefault();
      onChange(!checked);
    }
  }, [isDisabled, checked, onChange]);

  const trackStyle: React.CSSProperties = {
    ...TRACK_STYLE,
    backgroundColor: checked
      ? 'var(--sl-color-blue-10)'
      : 'var(--sl-color-gray-6)',
    ...(isDisabled ? { cursor: 'not-allowed', opacity: 0.5 } : {}),
  };

  const dotStyle: React.CSSProperties = {
    ...DOT_STYLE,
    transform: checked ? 'translateX(16px)' : 'translateX(0)',
  };

  return (
    <Clickable
      role="switch"
      aria-checked={checked}
      aria-disabled={isDisabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={trackStyle}
    >
      <Flex style={dotStyle} />
    </Clickable>
  );
}
