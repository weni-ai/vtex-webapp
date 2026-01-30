import { ABANDONED_CART_CODES } from "../constants/abandonedCart";

function isAbandonedCart(agent: { origin: string, code: string } | undefined) {
    if (!agent) {
        return false;
    }

    if (isLegacyAbandonedCart(agent) || isActiveAbandonedCart(agent)) {
        return true;
    }

    return false;
}

function isLegacyAbandonedCart(agent: { origin: string, code: string } | undefined) {
    if (!agent) {
        return false;
    }

    return agent.origin === 'commerce' && agent.code === ABANDONED_CART_CODES.LEGACY;
}

function isActiveAbandonedCart(agent: { origin: string, code: string } | undefined) {
    if (!agent) {
        return false;
    }

    return agent.origin === 'CLI' && agent.code === ABANDONED_CART_CODES.ACTIVE;
}

export { isAbandonedCart, isLegacyAbandonedCart, isActiveAbandonedCart };