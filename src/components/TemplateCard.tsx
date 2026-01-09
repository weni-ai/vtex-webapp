import { Button, Flex, Grid, IconButton, IconDotsThreeVertical, IconPauseCircle, MenuItem, MenuPopover, MenuProvider, MenuTrigger, Skeleton, Spinner, Tag, Text } from "@vtex/shoreline";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Template } from "../pages/agent/Index";
import { disableAssignedAgentTemplate } from "../services/agent.service";
import store from "../store/provider.store";

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

export function TemplateStatusTag({ status, size = 'normal' }: { status: Template['status'], size?: 'normal' | 'large' }) {
  const color = {
    active: 'green' as const,
    rejected: 'red' as const,
    pending: 'yellow' as const,
    'needs-editing': 'orange' as const,
  }[status];

  const statusText = t(`template.card.status.${status.replace(/-/g, '_')}`);

  return (
    <Tag
      variant="secondary"
      color={color}
      style={{ border: 'none', whiteSpace: 'nowrap', }}
      size={size}
    >
      {statusText}
    </Tag>
  )
}

export function TemplateCardSkeleton({ count }: { count: number }) {
  return (
    Array.from({ length: count }).map((_, index) => (
      <Skeleton key={index} />
    ))
  )
}

export function TemplateCard({ uuid, name, description, status, loadAgentDetails, hasMenuOptions = true }: Template & { loadAgentDetails: () => void, hasMenuOptions?: boolean }) {
  const navigate = useNavigate();
  const [isDisabling, setIsDisabling] = useState(false);

  function navigateToTemplate(templateUuid: string) {
    const assignedAgentUuid = store.getState().project.assignedAgents
      .find((agent) => agent.templates.some((template) => template.uuid === templateUuid))?.uuid;

    if (!assignedAgentUuid) {
      return;
    }

    navigate(`/agents/${assignedAgentUuid}/templates/${templateUuid}/edit`);
  }

  async function disableTemplate() {
    try {
      setIsDisabling(true);
      await disableAssignedAgentTemplate({ templateUuid: uuid });
      loadAgentDetails();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDisabling(false);
    }
  }

  return (
    <Flex direction="column" gap="$space-2" style={{
      border: 'var(--sl-border-base)',
      borderRadius: 'var(--sl-radius-2)',
      padding: 'var(--sl-space-4)',
    }}>
      <Flex gap="$space-2" align="center">
        <Text variant="display3" color="$fg-base">{name}</Text>

        <TemplateStatusTag status={status} />

        {hasMenuOptions && (
          <Flex style={{ marginLeft: 'auto', alignSelf: 'flex-start' }}>
            {isDisabling ? (
              <Flex style={{ padding: 'var(--sl-space-2)' }}>
                <Spinner size={20} />
              </Flex>
            ) : (
              <MenuProvider>
                <MenuTrigger asChild>
                  <IconButton variant="tertiary" label={t('template.card.actions.label')}>
                    <IconDotsThreeVertical />
                  </IconButton>
                </MenuTrigger>

                <MenuPopover>
                  <MenuItem onClick={disableTemplate}>
                    <IconPauseCircle />
                    {t('template.card.actions.disable')}
                  </MenuItem>
                </MenuPopover>
              </MenuProvider>
            )}
          </Flex>
        )}
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

      <Button
        variant="primary"
        size="large"
        style={{ marginTop: 'auto' }}
        onClick={() => navigateToTemplate(uuid)}
        disabled={!['active', 'needs-editing', 'rejected'].includes(status)}
      >
        {t('template.card.buttons.edit')}
      </Button>
    </Flex>
  )
}
