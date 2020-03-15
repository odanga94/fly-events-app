import Event from '../../models/event';
import { CREATE_EVENT, SET_EVENTS, DELETE_EVENT, UPDATE_EVENT } from '../actions/events';

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
        case DELETE_EVENT:
            return {
                ...state,
                upComingEvents: state.upComingEvents.filter(upComingEvent => upComingEvent.id !== action.eid),
                userEvents: state.userEvents.filter(userEvent => userEvent.id !== action.eid)
            }
        case CREATE_EVENT:
            const newEvent = new Event(
                action.eventData.id,
                action.eventData.ownerId,
                action.eventData.title,
                action.eventData.description,
                action.eventData.imageUri,
                action.eventData.price,
                action.eventData.date,
                action.eventData.eventTime,
                action.eventData.location
            )
            return {
                ...state,
                upComingEvents: state.upComingEvents.concat(newEvent),
                userEvents: state.userEvents.concat(newEvent)
            }
        case UPDATE_EVENT: 
            const eventIndex = state.userEvents.findIndex(event => event.id === action.eid);
            const updatedEvent = new Event(
                action.eid, 
                state.userEvents[eventIndex].ownerId,
                action.eventData.title,
                action.eventData.description,
                action.eventData.imageUri,
                action.eventData.price,
                action.eventData.date,
                action.eventData.eventTime,
                action.eventData.location,
                {...state.upComingEvents[eventIndex].attendees}
            );
            const updatedUserEvents = [...state.userEvents];
            updatedUserEvents[eventIndex] = updatedEvent;
            const upComingEventIndex = state.upComingEvents.findIndex(event => event.id === action.eid);
            const updatedUpComingEvents = [...state.upComingEvents];
            updatedUpComingEvents[upComingEventIndex] = updatedEvent;
            return {
                ...state,
                upComingEvents: updatedUpComingEvents,
                userEvents: updatedUserEvents
            }
        default: 
            return state;
    }
};