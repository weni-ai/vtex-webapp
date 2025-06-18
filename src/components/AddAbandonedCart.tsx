import { Button, Flex, Modal, ModalContent, ModalDismiss, ModalFooter, ModalHeader, ModalHeading, Radio, RadioGroup, Text } from "@vtex/shoreline";
import { ChangeEvent, useState } from "react";
import { Trans } from "react-i18next";
import { InputCopyToClipboard } from "./InputCopyToClipboard";

export interface AddAbandonedCartProps {
  open: boolean,
  toggleModal: () => void;
  confirm: () => void;
}

export function AddAbandonedCart({ open, toggleModal, confirm }: AddAbandonedCartProps) {
  const [channel, setChannel] = useState('site_editor');

  return (
    <Modal open={open} onClose={toggleModal} size="large">
      <ModalHeader>
        <Flex>
          <ModalHeading>
            {t('agents.categories.active.abandoned_cart.modal.title')}
          </ModalHeading>
        </Flex>
        <ModalDismiss />
      </ModalHeader>

      <ModalContent>
        <Flex direction="column">
          <Text variant="display3">
            {t('agent.setup.forms.channel.container_title')}
          </Text>

          <RadioGroup
            label={t('agent.setup.forms.channel.title')}
            defaultValue={channel}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setChannel(e.target.value)}
          >
            <Flex direction="row" gap="var(--space-5, 20px)">
              <Radio value={'site_editor'} checked={channel === 'site_editor'}>{t('agent.setup.forms.channel.site_editor')}</Radio>
              <Radio value={'other'} checked={channel === 'other'}>{t('agent.setup.forms.channel.other')}</Radio>
            </Flex>
          </RadioGroup>

          {channel === 'other' && (
            <>
              <Text variant="body">
                <Trans i18nKey={'agent.setup.forms.channel.description'} components={[<br />, <br />, <b />]} />
              </Text>

              <InputCopyToClipboard
                value={'<script type="text/javascript" src="https://appvtexio.weni.ai/pixel.js"></script>'}
                successMessage={t('common.script_copied')}
              />
            </>
          )}
        </Flex>
      </ModalContent>

      <ModalFooter>
        <Button onClick={toggleModal}>{t('common.cancel')}</Button>
        <Button variant="primary" onClick={confirm}>{t('common.finish')}</Button>
      </ModalFooter>
    </Modal >
  )
}
