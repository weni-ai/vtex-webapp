import { Flex, Heading, Modal, ModalContent, ModalDismiss, ModalHeader, ModalHeading } from "@vtex/shoreline";
import { useSelector } from "react-redux";
import { RootState } from "../../../interfaces/Store";
import { AgentBox, AgentBoxContainer } from "../../AgentBox";

export function AgentsGalleryModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const agentsList = useSelector((state: RootState) => state.project.agents).filter((agent) => !agent.isAssigned);

  return (
    <Modal open={open} onClose={onClose} size="large">
      <ModalHeader>
        <ModalHeading>Agents Gallery</ModalHeading>
        <ModalDismiss />
      </ModalHeader>

      <ModalContent>
        {agentsList.length === 0 && (
          <Flex justify="center" align="center" style={{ height: '400px' }}>
            <Heading variant="display3">No results founded</Heading>
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
              />
            ))}
          </AgentBoxContainer>
        )}
      </ModalContent>
    </Modal>
  )
}
