import { Flex, Button, MenuProvider, MenuTrigger, MenuPopover, MenuSeparator, CheckboxGroup, Checkbox, Heading, IconCaretDown } from "@vtex/shoreline";
import { useState, useMemo, useEffect } from "react";
import { RootState } from "../../interfaces/Store";
import { useSelector } from "react-redux";
import { AgentBox, AgentBoxContainer } from "../AgentBox";

function DropdownMenu({ label, noneSelected, value, setValue, options }: {
  label: string,
  noneSelected: string,
  value: string[],
  options: { value: string, label: string }[],
  setValue: (value: string[]) => void,
}) {
  const [localValue, setLocalValue] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const isSame = useMemo(() => {
    return localValue.length === value.length && localValue.every((category) => value.includes(category));
  }, [localValue, value]);

  useEffect(() => {
    if (isOpen) {
      setLocalValue(value);
    }
  }, [isOpen]);

  return (
    <MenuProvider placement="bottom-start" open={isOpen} setOpen={setIsOpen}>
      <MenuTrigger asChild>
        <Button variant="secondary">
          <Flex align="center" gap="$space-1">
            {label}:{' '}

            {
              value.length === 0 || (value.length === options.length && options.every((option) => value.includes(option.value))) ?
                noneSelected :
                value.map((category) => options.find((option) => option.value === category)?.label).join(', ')
            }

            <IconCaretDown width={16} height={16} />
          </Flex>
        </Button>
      </MenuTrigger>

      <MenuPopover>
        <Flex style={{ padding: '0 var(--sl-space-2) var(--sl-space-4)' }}>
          <CheckboxGroup label="">
            {options.map((option) => (
              <Checkbox
                checked={localValue.includes(option.value)}
                onChange={() => setLocalValue(
                  (localValue.includes(option.value) ?
                    localValue.filter((category) => category !== option.value) :
                    [...localValue, option.value]) as ('active' | 'passive')[]
                )}
              >
                {option.label}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </Flex>

        <MenuSeparator />

        <Flex
          justify="end"
          gap="$space-2"
          style={{
            padding: 'var(--sl-space-4) var(--sl-space-3) var(--sl-space-3) var(--sl-space-3)'
          }}
        >
          <Button variant="secondary" disabled={localValue.length === 0} onClick={() => {
            setLocalValue([]);
            setValue([]);
          }}>
            {t('common.clear')}
          </Button>

          <Button variant="primary" disabled={isSame} onClick={() => {
            setValue(localValue);
            setIsOpen(false);
          }}>
            {t('common.apply')}
          </Button>
        </Flex>
      </MenuPopover>
    </MenuProvider>
  );
}

export function AgentsList({ onAssign }: { onAssign: (uuid: string) => void }) {
  const unassignedAgents = useSelector((state: RootState) => state.project.agents).filter((agent) => !agent.isAssigned);
  const [categories, setCategories] = useState<('active' | 'passive')[]>([]);
  const [agents, setAgents] = useState<('official' | 'custom')[]>([]);

  function handleAssign(uuid: string) {
    onAssign(uuid);
  }

  const agentsList = useMemo(() => {
    return unassignedAgents.filter((agent) => {
      let shouldShow = true;

      if (categories.length > 0) {
        if (!categories.includes(agent.notificationType)) {
          shouldShow = false;
        }
      }

      if (agents.length > 0) {
        const isOfficialValues = [];

        if (agents.includes('official')) {
          isOfficialValues.push(true);
        }

        if (agents.includes('custom')) {
          isOfficialValues.push(false);
        }

        if (!isOfficialValues.includes(agent.isOfficial)) {
          shouldShow = false;
        }
      }

      return shouldShow;
    });
  }, [unassignedAgents, categories]);

  return (
    <Flex direction="column">
      <Flex align="center">
        <DropdownMenu
          label={t('agents.modals.gallery.filters.categories.title')}
          noneSelected={t('agents.modals.gallery.filters.categories.none_selected')}
          value={categories}
          setValue={(value) => setCategories(value as ('active' | 'passive')[])}
          options={[
            {
              value: 'active',
              label: t('agents.categories.active.title')
            },
            {
              value: 'passive',
              label: t('agents.categories.passive.title')
            }
          ]}
        />

        <DropdownMenu
          label={t('agents.modals.gallery.filters.agents.title')}
          noneSelected={t('agents.modals.gallery.filters.agents.none_selected')}
          value={agents}
          setValue={(value) => setAgents(value as ('official' | 'custom')[])}
          options={[
            {
              value: 'official',
              label: t('agents.modals.gallery.filters.agents.options.official')
            },
            {
              value: 'custom',
              label: t('agents.modals.gallery.filters.agents.options.custom')
            }
          ]}
        />
      </Flex>

      {agentsList.length === 0 && (
        <Flex justify="center" align="center" style={{ height: '400px' }}>
          <Heading variant="display3">{t('agents.modals.gallery.list.empty.title')}</Heading>
        </Flex>
      )}

      {agentsList.length > 0 && (
        <AgentBoxContainer>
          {agentsList.map((item) => (
            <AgentBox
              key={item.uuid}
              name={item.name || ''}
              description={item.description || ''}
              uuid={item.uuid}
              code={item.code as 'order_status' | 'abandoned_cart'}
              type={item.notificationType}
              isIntegrated={item.isAssigned}
              origin={item.origin}
              isInTest={item.isInTest}
              isConfiguring={item.isConfiguring || false}
              skills={item.skills || []}
              onAssign={handleAssign}
            />
          ))}
        </AgentBoxContainer>
      )}
    </Flex>
  );
}
