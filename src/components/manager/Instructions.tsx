import {
  DrawerProvider,
  DrawerTrigger,
  DrawerPopover,
  DrawerHeader,
  DrawerHeading,
  DrawerDismiss,
  DrawerContent, Text,
  Flex,
  Field,
  Textarea,
  FieldDescription, toast
} from '@vtex/shoreline';
import { Button } from '../adapters/Button';
import { useState } from 'react';

import './Instructions.css';
import { getManager, removeManagerInstruction, updateManagerInstructions } from '../../services/agent.service';
import { InstructionsList } from './InstructionsList';

export function Instructions() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [customInstructionsState, setCustomInstructionsState] = useState<'loading' | 'success' | 'error' | undefined>(undefined);
  const [customInstructionsList, setCustomInstructionsList] = useState<{ id: number; value: string; }[]>([]);

  async function fetchManager() {
    setCustomInstructionsState('loading');

    try {
      const manager = await getManager();
      setCustomInstructionsList(manager.instructions);
      setCustomInstructionsState('success');
    } catch (error) {
      toast.critical(t('instructions_drawer.instructions_list.messages.error_retrieving_instructions'));
      setCustomInstructionsState('error');
    }
  }

  async function addInstruction(value: string) {
    const { instructions } = await updateManagerInstructions([
      ...customInstructionsList,
      { value }
    ]);

    setCustomInstructionsList(instructions);
  }

  async function updateInstruction(id: number, value: string) {
    const { instructions } = await updateManagerInstructions(customInstructionsList.map((instruction) => ({
      id: instruction.id,
      value: id === instruction.id ? value : instruction.value,
    })));

    setCustomInstructionsList(instructions);
  }

  async function removeInstruction(id: number) {
    const { instructions } = await removeManagerInstruction(id);
    setCustomInstructionsList(instructions);
  }

  function handleOpenDrawer(isOpen: boolean) {
    setIsDrawerOpen(isOpen);

    if (isOpen) {
      fetchManager();
    }
  }

  return (
    <DrawerProvider open={isDrawerOpen} onOpenChange={handleOpenDrawer}>
      <DrawerTrigger asChild>
        <Button variant="tertiary" size="normal">{t('instructions_drawer.open')}</Button>
      </DrawerTrigger>

      <DrawerPopover>
        <DrawerHeader className="instructions-drawer-header">
          <DrawerHeading>{t('instructions_drawer.title')}</DrawerHeading>
          <DrawerDismiss />
        </DrawerHeader>

        <DrawerContent>
          <NewInstructionField
            addInstruction={addInstruction}
          />

          <InstructionsList
            customInstructionsState={customInstructionsState}
            customInstructionsList={customInstructionsList}
            updateInstruction={updateInstruction}
            removeInstruction={removeInstruction}
          />
        </DrawerContent>
      </DrawerPopover>
    </DrawerProvider>
  )
}

function NewInstructionField({
  addInstruction,
}: {
  addInstruction: (value: string) => void;
}) {
  const [customInstruction, setCustomInstruction] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  async function saveInstruction() {
    setIsAdding(true);

    try {
      await addInstruction(customInstruction);
      toast.success(t('instructions_drawer.instructions_list.messages.success_adding_custom_instruction'));
      setCustomInstruction('');
    } catch (error) {
      toast.critical(t('instructions_drawer.instructions_list.messages.error_adding_custom_instruction'));
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <Flex direction="column" gap="$space-4">
      <Text variant="display3">
        {t('instructions_drawer.new_custom_instruction.title')}
      </Text>

      <Field>
        <Textarea
          className="content-textarea-full-width"
          value={customInstruction}
          onChange={setCustomInstruction}
          maxLength={200}
        />

        <FieldDescription>
          <Flex direction="row" gap="$space-2" justify="space-between">
            <span>{t('instructions_drawer.new_custom_instruction.hint')}</span>
            <span>{customInstruction.trim().length} / 200</span>
          </Flex>
        </FieldDescription>
      </Field>

      <Button
        variant="primary"
        onClick={saveInstruction}
        size="normal"
        style={{ alignSelf: 'flex-start' }}
        disabled={customInstruction.trim().length === 0}
        loading={isAdding}
      >
        {t('instructions_drawer.new_custom_instruction.buttons.save')}
      </Button>
    </Flex>
  )
}
