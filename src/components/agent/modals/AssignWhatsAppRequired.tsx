import { Flex, Text } from "@vtex/shoreline";
import { useSelector } from "react-redux";
import { RootState } from "../../../interfaces/Store";
import { Channel } from "../../../pages/Channel";

export function AssignWhatsAppRequired() {
  const isWppIntegrated = useSelector((state: RootState) => state.user.isWhatsAppIntegrated);

  return (
    <Flex direction="column" gap="$space-4">
      <Text variant="display3">
        {t('agents.modals.assign.integrate_support_channel.title')}
      </Text>

      <Channel isIntegrated={isWppIntegrated} showSkipDisclaimer={false} />
    </Flex>
  )
}
