import { Button, Flex, Grid, IconButton, IconDotsThreeVertical, IconPauseCircle, MenuItem, MenuPopover, MenuProvider, MenuTrigger, Skeleton, Tag, Text } from "@vtex/shoreline";
import { Template } from "../pages/agent/Index";

export function TemplateCardContainer({ children }: { children: React.ReactNode }) {
  return (
    <Grid
      columns="repeat(auto-fill, minmax(21.5rem, 1fr))"
      rows="192px"
      autoRows="var(--sl-grid-rows)"
      gap="$space-6"
    >
      {children}
    </Grid>
  )
}

function TemplateStatusTag({ status }: { status: Template['status'] }) {
  const color = {
    active: 'green' as const,
    rejected: 'red' as const,
    pending: 'yellow' as const,
    'needs-editing': 'orange' as const,
  }[status];

  const statusText = t(`template.card.status.${status.replace(/-/g, '_')}`);

  return (
    <Tag variant="secondary" color={color} style={{ border: 'none' }}>{statusText}</Tag>
  )
}

export function TemplateCardSkeleton({ count }: { count: number }) {
  return (
    Array.from({ length: count }).map((_, index) => (
      <Skeleton key={index} />
    ))
  )
}

export function TemplateCard({ name, description, status }: Template) {
  return (
    <Flex direction="column" gap="$space-2" style={{
      border: 'var(--sl-border-base)',
      borderRadius: 'var(--sl-radius-2)',
      padding: 'var(--sl-space-4)',
    }}>
      <Flex gap="$space-1" justify="space-between">
        <Flex align="center" gap="$space-2">
          <Text variant="display3" color="$fg-base">{name}</Text>
          <TemplateStatusTag status={status} />
        </Flex>

        <MenuProvider>
          <MenuTrigger asChild>
            <IconButton variant="tertiary" label={t('template.card.actions.label')}>
              <IconDotsThreeVertical />
            </IconButton>
          </MenuTrigger>

          <MenuPopover>
            <MenuItem>
              <IconPauseCircle />
              {t('template.card.actions.disable')}
            </MenuItem>
          </MenuPopover>
        </MenuProvider>
      </Flex>

      <Flex style={{ height: '60px' }}>
        <Text
          variant="body"
          color="$fg-base-soft"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: '3',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {description}
        </Text>
      </Flex>

      <Button variant="primary" size="large" style={{ marginTop: 'auto' }}>
        {t('template.card.buttons.edit')}
      </Button>
    </Flex>
  )
}
