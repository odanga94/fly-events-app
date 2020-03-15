export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';

export const addToCart = (event) => {
    return {
        type: ADD_TO_CART,
        event
    }
};

export const removeFromCart = eventId => {
    return {
        type: REMOVE_FROM_CART,
        eventId
    }
};
