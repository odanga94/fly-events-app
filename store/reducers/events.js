import Event from '../../models/event';
import { CREATE_EVENT, SET_EVENTS } from '../actions/events';

const initialState = {
    upComingEvents: [],
    userEvents: []
};

export default (state = initialState, action) => {
    switch (action.type){
        case SET_EVENTS: 
            return {
                ...state,
                upComingEvents: action.events,
                userEvents: action.userEvents
            }
        /*case DELETE_PRODUCT:
            return {
                ...state,
                availableProducts: state.availableProducts.filter(availableProduct => availableProduct.id !== action.pid),
                userProducts: state.userProducts.filter(userProduct => userProduct.id !== action.pid)
            }*/
        case CREATE_EVENT:
            const newEvent = new Event(
                action.eventData.id,
                action.eventData.ownerId,
                action.eventData.title,
                action.eventData.description,
                action.eventData.imageUri,
                action.eventData.price,
                action.eventData.date
            )
            return {
                ...state,
                upComingEvents: state.upComingEvents.concat(newEvent),
                userEvents: state.userEvents.concat(newEvent)
            }
        /*case UPDATE_PRODUCT: 
            const prodIndex = state.userProducts.findIndex(prod => prod.id === action.pid);
            const updatedProduct = new Product(
                action.pid, 
                state.userProducts[prodIndex].ownerId,
                action.productData.title,
                action.productData.imageUrl,
                action.productData.description,
                state.userProducts[prodIndex].price
            );
            const updatedUserProducts = [...state.userProducts];
            updatedUserProducts[prodIndex] = updatedProduct;
            const availableProdIndex = state.availableProducts.findIndex(prod => prod.id === action.pid);
            const updatedAvailableProducts = [...state.availableProducts];
            updatedAvailableProducts[availableProdIndex] = updatedProduct;
            return {
                ...state,
                availableProducts: updatedAvailableProducts,
                userProducts: updatedUserProducts
            }*/
        default: 
            return state;
    }
};