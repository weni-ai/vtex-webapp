import { Link, Text } from "@vtex/shoreline";

export function GenericErrorToast() {
  return (
    <Text>
      {t('common.errors.generic_error_with_support')}{' '}
      <Link
        href="mailto:support.weni@vtex.com"
        style={{ textDecoration: 'underline', color: 'var(--sl-text-color)' }}
      >
        support.weni@vtex.com
      </Link>
    </Text>
  );
}
