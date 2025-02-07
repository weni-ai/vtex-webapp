import { Flex, Modal, ModalContent, ModalDismiss, ModalHeader, ModalHeading, Text } from "@vtex/shoreline";
import activeAbandonedCartPreview from '../assets/agents_preview/active_abandoned_cart.png';
import activeOrderStatusPreview from '../assets/agents_preview/active_order_status.svg';
import { TagType } from "./TagType";

type categories = 'active' | 'passive';
type codes = 'abandoned-cart' | 'order-status';

const previews: {[K in categories]?: {[L in codes]?: string}} = {
    active: {
        'abandoned-cart': activeAbandonedCartPreview,
        'order-status': activeOrderStatusPreview,
    },
};

export interface AboutAgentProps {
    open: boolean,
    category: 'active' | 'passive';
    code: codes;
    toggleModal: () => void;
}

export function AboutAgent({ code, open, category, toggleModal }: AboutAgentProps) {
    return (
        <Modal open={open} onClose={toggleModal} >
            <ModalHeader>
                <Flex>
                    <ModalHeading>
                        {t(`agents.categories.${category}.${code}.title`)}
                    </ModalHeading>

                    <TagType type={category} />
                </Flex>
                <ModalDismiss />
            </ModalHeader>
            <ModalContent>
                <Flex style={{
                    width: '100%', padding: '32px', justifyContent: 'center', backgroundColor: '#d9e7fb', borderRadius: 'var(--radius-2, 8px)',
                    border: '1px solid var(--border-base, #E0E0E0)'
                }}>
                    <img
                        src={previews[category]?.[code]}
                        alt={t(`agents.categories.${category}.${code}.title`)}
                    />
                </Flex>
                <Flex direction="column" style={{width: '100%', marginTop: '20px', gap: '4px'}}>
                    <Text variant="emphasis">
                        {t(`agents.categories.${category}.${code}.details.title`)}
                    </Text>
                    <Text variant="body" color="$fg-base-soft">
                        {t(`agents.categories.${category}.${code}.details.description`)}
                    </Text>
                </Flex>
            </ModalContent>
        </Modal >
    )
}