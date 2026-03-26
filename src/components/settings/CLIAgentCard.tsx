import {
  Flex,
  IconButton,
  MenuItem,
  MenuPopover,
  MenuProvider,
  MenuTrigger,
  Text,
} from '@vtex/shoreline';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../adapters/Button';
import { IconDotsThreeVertical, IconTrash } from '../adapters/Icon';
import { DisableAgent } from '../DisableAgent';

interface CLIAgentCardProps {
  uuid: string;
  name: string;
  description: string;
  code: string;
  type: 'active' | 'passive';
  assignedAgentUuid: string;
}

const cardStyle: React.CSSProperties = {
  border: 'var(--sl-border-base)',
  borderRadius: 'var(--sl-radius-2)',
  padding: '16px',
};

const truncatedTextStyle: React.CSSProperties = {
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical' as const,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minHeight: '40px',
};

export function CLIAgentCard({ uuid, name, description, code, type, assignedAgentUuid }: CLIAgentCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);

  const agentName =
    t(`agents.categories.${type}.${code}.title`) === `agents.categories.${type}.${code}.title`
      ? name
      : t(`agents.categories.${type}.${code}.title`);

  const agentDescription =
    t(`agents.categories.${type}.${code}.description`) === `agents.categories.${type}.${code}.description`
      ? description
      : t(`agents.categories.${type}.${code}.description`);

  function handleView() {
    navigate(`/agents/${assignedAgentUuid}`);
  }

  function toggleDisableModal() {
    setIsDisableModalOpen((prev) => !prev);
  }

  return (
    <>
      <Flex direction="column" gap="$space-3" style={cardStyle}>
        <Flex gap="$space-1" justify="space-between">
          <Flex align="center" gap="$space-1" style={{ flex: '1 1 0', minWidth: 0 }}>
            <Text
              variant="display3"
              color="$fg-base"
              style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {agentName}
            </Text>

            <Text variant="caption1" color="$fg-base-soft" style={{ textWrap: 'nowrap' }}>
              PT-BR
            </Text>
          </Flex>

          <MenuProvider>
            <MenuTrigger asChild>
              <IconButton variant="tertiary" label="Actions" data-testid="cli-agent-actions-button">
                <IconDotsThreeVertical size="20" />
              </IconButton>
            </MenuTrigger>

            <MenuPopover>
              <MenuItem onClick={toggleDisableModal} data-testid="cli-agent-remove-button">
                <IconTrash size="20" />
                {t('agents.buttons.remove_automation')}
              </MenuItem>
            </MenuPopover>
          </MenuProvider>
        </Flex>

        <Text variant="body" color="$fg-base-soft" style={truncatedTextStyle} title={agentDescription}>
          {agentDescription}
        </Text>

        <Button variant="secondary" size="large" onClick={handleView} data-testid="cli-agent-view-button">
          {t('agents.common.view')}
        </Button>
      </Flex>

      <DisableAgent
        open={isDisableModalOpen}
        toggleModal={toggleDisableModal}
        agent={agentName}
        agentUuid={uuid}
        agentOrigin="CLI"
      />
    </>
  );
}
