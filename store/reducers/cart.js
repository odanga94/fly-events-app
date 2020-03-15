import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/cart';
import { ADD_ORDER } from '../actions/orders';
import { DELETE_PRODUCT } from '../actions/events';
import CartItem from '../../models/cart-item';

const initialState = {
    items: {},
    totalAmount: 0
};

export default (state = initialState, action) => {
    switch(action.type){
        case ADD_TO_CART:
            const addedEvent = action.event;
            const eventPrice = addedEvent.price;
            const eventTitle = addedEvent.title;

            let updatedOrNewCartItem;

            if (state.items[addedEvent.id]){
                // already have the item in the cart
                updatedOrNewCartItem = new CartItem(
                    state.items[addedEvent.id].quantity + 1,
                    eventPrice,
                    eventTitle,
                    state.items[addedEvent.id].sum + eventPrice
                );
            } else {
                updatedOrNewCartItem = new CartItem(1, eventPrice, eventTitle, eventPrice);
            }
            return {
                ...state,
                items: {
                    ...state.items,
                    [addedEvent.id]: updatedOrNewCartItem,
                },
                totalAmount: state.totalAmount + eventPrice
            }
        case REMOVE_FROM_CART:
            const selectedCartItem = state.items[action.eventId];
            const currentQty = selectedCartItem.quantity;
            let updatedCartItems;
            if (currentQty > 1){
                //need to reduce it, not erase it
                const updatedCartItem = new CartItem(currentQty - 1, selectedCartItem.eventPrice, selectedCartItem.eventTitle, selectedCartItem.sum - selectedCartItem.eventPrice);
                updatedCartItems = { ...state.items, [action.eventId]: updatedCartItem }
            } else {
                updatedCartItems = { ...state.items }
                delete updatedCartItems[action.eventId];
            }
            return {
                ...state,
                items: updatedCartItems,
                totalAmount: state.totalAmount - selectedCartItem.eventPrice
            }
        case ADD_ORDER:
            return initialState
        case DELETE_PRODUCT:
            if (!state.items[action.pid]){
                return state;
            }
            const updatedItems = {
                ...state.items
            };
            const itemTotal = state.items[action.pid].sum;
            delete updatedItems[action.pid];
            return {
                ...state,
                items: updatedItems,
                totalAmount: state.totalAmount - itemTotal
            }

    }
    return state;
}