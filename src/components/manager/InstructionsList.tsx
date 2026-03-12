import { Tab, TabPanel, TabProvider, useTabStore, Flex, Text, Skeleton, TabList, Bleed, MenuItem, toast, MenuTrigger, Spinner, MenuProvider, IconButton, IconDotsThreeVertical, MenuPopover, Input, IconPencil, IconTrash, ConfirmationModal } from "@vtex/shoreline";
import { Button } from "../adapters/Button";
import { useEffect, useMemo, useState } from "react";

export function InstructionsList({
  customInstructionsState,
  customInstructionsList,
  updateInstruction,
  removeInstruction,
}: {
  customInstructionsState: 'loading' | 'success' | 'error' | undefined,
  customInstructionsList: { id: number; value: string; }[],
  updateInstruction: (id: number, value: string) => void,
  removeInstruction: (id: number) => void,
}) {
  const tabStore = useTabStore();

  const defaultInstructions = useMemo(() => {
    return t('instructions_drawer.instructions_list.default_instructions', { returnObjects: true }) as string[];
  }, [t]);

  const safetyTopicsInstructions = useMemo(() => {
    return t('instructions_drawer.instructions_list.safety_topics', { returnObjects: true }) as string[];
  }, [t]);

  return (
    <Flex direction="column" gap="$space-4" style={{ marginTop: 'var(--sl-space-5)' }}>
      <Text variant="display3">
        {t('instructions_drawer.instructions_list.title')}
      </Text>

      <section>
        {customInstructionsState === 'loading' ? (
          <InstructionsListSkeleton />
        ) : (
          <TabProvider store={tabStore}>
            <TabList>
              <Tab id="custom">
                {t('instructions_drawer.instructions_list.tabs.custom')}
              </Tab>

              <Tab id="default">
                {t('instructions_drawer.instructions_list.tabs.default')}
              </Tab>

              <Tab id="safety_topics">
                {t('instructions_drawer.instructions_list.tabs.safety_topics')}
              </Tab>
            </TabList>

            <TabPanel tabId="custom">
              <Bleed start="$space-3" end="$space-3">
                {customInstructionsList.length === 0 ? (
                  <Text variant="body" color="$fg-base-soft">
                    {t('instructions_drawer.instructions_list.no_custom_instructions')}
                  </Text>
                ) : (
                  <InstructionsTable
                    instructions={customInstructionsList}
                    updateInstruction={updateInstruction}
                    removeInstruction={removeInstruction}
                  />
                )}
              </Bleed>
            </TabPanel>

            <TabPanel tabId="default">
              <Bleed start="$space-3" end="$space-3">
                <InstructionsTable
                  instructions={defaultInstructions.map((instructionValue, index) => ({
                    id: index,
                    value: instructionValue,
                  }))}
                />
              </Bleed>
            </TabPanel>

            <TabPanel tabId="safety_topics">
              <Bleed start="$space-3" end="$space-3">
                <InstructionsTable
                  instructions={safetyTopicsInstructions.map((instructionValue, index) => ({
                    id: index,
                    value: instructionValue,
                  }))}
                />
              </Bleed>
            </TabPanel>
          </TabProvider>
        )}
      </section>
    </Flex>
  )
}

function InstructionsTable(props: {
  instructions: { id: number; value: string; }[],
  updateInstruction?: (id: number, value: string) => void;
  removeInstruction?: (id: number) => void;
}) {
  return (
    <Flex direction="column" gap="$space-0" className="instructions-list">
      {props.instructions.map((instruction) => (
        <InstructionItem
          key={instruction.id}
          {...instruction}
          updateInstruction={props.updateInstruction}
          removeInstruction={props.removeInstruction}
        />
      ))}
    </Flex>
  )
}

function InstructionItem({
  id,
  value,
  updateInstruction,
  removeInstruction,
}: {
  id?: number;
  value: string;
  updateInstruction?: (id: number, value: string) => void;
  removeInstruction?: (id: number) => void;
}) {
  const [localValue, setLocalValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const [isOpenRemoveInstructionConfirmationModal, setIsOpenRemoveInstructionConfirmationModal] = useState(false);

  function startEdit() {
    setIsEditing(true);
  }

  async function saveEdit() {
    if (!id || !updateInstruction) return;

    setIsSaving(true);

    try {
      await updateInstruction(id, localValue);
      setIsEditing(false);
    } catch (error) {
      toast.critical(t('instructions_drawer.instructions_list.messages.error_editing_custom_instruction'));
    } finally {
      setIsSaving(false);
    }
  }

  function cancelEdit() {
    setLocalValue(value);
    setIsEditing(false);
  }

  async function handleRemoveInstruction() {
    if (!id || !removeInstruction) return;

    setIsOpenRemoveInstructionConfirmationModal(false);
    setIsRemoving(true);

    try {
      await removeInstruction(id);
    } catch (error) {
      toast.critical(t('instructions_drawer.instructions_list.messages.error_removing_custom_instruction'));
    } finally {
      setIsRemoving(false);
    }
  }

  const actions = useMemo(() => {
    return [
      updateInstruction && {
        props: {
          onClick: startEdit,
          children: <><IconPencil /> {t('instructions_drawer.instructions_list.actions.edit')}</>,
        },
      },
      removeInstruction && {
        props: {
          onClick: () => setIsOpenRemoveInstructionConfirmationModal(true),
          critical: true,
          children: <><IconTrash /> {t('instructions_drawer.instructions_list.actions.remove')}</>,
        },
      },
    ].filter(Boolean);
  }, [updateInstruction, removeInstruction]);

  return (
    <Flex className="instruction-item" align="center" justify="space-between" gap="$space-2">
      <RemoveInstructionConfirmationModal
        isOpen={isOpenRemoveInstructionConfirmationModal}
        onClose={() => setIsOpenRemoveInstructionConfirmationModal(false)}
        onConfirm={handleRemoveInstruction}
      />

      {isEditing ? (
        <>
          <Input
            value={localValue}
            onChange={setLocalValue}
          />

          <Button
            variant="secondary"
            size="large"
            onClick={saveEdit}
            loading={isSaving}
            disabled={localValue.trim().length === 0 || localValue.trim() === value.trim()}
          >
            {t('instructions_drawer.instructions_list.actions.save')}
          </Button>

          <Button variant="tertiary" size="large" onClick={cancelEdit}>
            {t('instructions_drawer.instructions_list.actions.cancel')}
          </Button>
        </>
      ) : (
        <Text variant="body" color="$fg-base-soft" style={{ width: 'fit-content' }}>
          {value}
        </Text>
      )}

      {!isEditing && actions.length > 0 && (
        <MenuProvider>
          <MenuTrigger asChild>
            <IconButton variant="tertiary" label="Actions" disabled={isRemoving}>
              {isRemoving ? (
                <Spinner description="removing instruction" />
              ) : (
                <IconDotsThreeVertical />
              )}
            </IconButton>
          </MenuTrigger>

          <MenuPopover>
            {actions.map((action, index) => (
              <MenuItem key={index} {...action?.props}>
                {action?.props?.children as React.ReactNode}
              </MenuItem>
            ))}
          </MenuPopover>
        </MenuProvider>
      )}
    </Flex>
  )
}

function RemoveInstructionConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <ConfirmationModal
      open={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      onCancel={onClose}
      messages={{
        title: t('instructions_drawer.remove_instruction_confirmation_modal.title'),
        confirm: t('instructions_drawer.remove_instruction_confirmation_modal.buttons.remove'),
        cancel: t('instructions_drawer.remove_instruction_confirmation_modal.buttons.cancel'),
      }}
      critical
    >
      <Text variant="body">{t('instructions_drawer.remove_instruction_confirmation_modal.description')}</Text>
    </ConfirmationModal>
  )
}

function InstructionsListSkeleton() {
  return (
    <Flex direction="column" gap="$space-3">
      <Skeleton width="100%" height="44px" />
      <Skeleton width="100%" height="120px" />
    </Flex>
  )
}
