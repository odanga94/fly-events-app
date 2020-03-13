import { BASE_URL } from '../../constants/base-url';
import Event from '../../models/event';

export const DELETE_EVENT = "DELETE_EVENT";
export const CREATE_EVENT = "CREATE_EVENT";
export const UPDATE_EVENT = "UPDATE_EVENT";
export const SET_EVENTS = "SET_EVENTS";

export const fetchEvents = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try {
            const response = await fetch(`${BASE_URL}events.json`);

            if (!response.ok){
                //console.log(response);
                throw new Error('Something went wrong!');
            }
            const resData = await response.json();
            //console.log(resData);
            const loadedEvents = resData ? Object.keys(resData).map(key => {
                return new Event(
                    key,
                    resData[key].ownerId,
                    resData[key].title,
                    resData[key].description,
                    resData[key].imageUri,
                    resData[key].price,
                    resData[key].eventDate,
                    resData[key].eventTime,
                    resData[key].location
                );
            }) : [];
            const upComingEvents = loadedEvents.filter(event => new Date().getTime() <= new Date(event.eventDate).getTime());
            upComingEvents.sort((a, b) => a.eventDate > b.eventDate ? 1 : -1)
            //console.log(loadedProducts);
            dispatch({
                type: SET_EVENTS,
                events: upComingEvents,
                userEvents: loadedEvents.filter(event => event.ownerId === userId)
            })
        } catch (err) {
            // send to custom analytics server
            throw err;
        }  
    }
}

export const deleteProduct = (productId) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(`${BASE_URL}products/${productId}.json?auth=${token}`, {
            method: 'DELETE',
        });

        if(!response.ok){
            throw new Error('Something went wrong!')
        }

        dispatch({
            type: DELETE_EVENT,
            pid: productId
        });
    }
}

export const createEvent = (title, description, imageUri, price, date, eventTime, location) => {
    return async (dispatch, getState) => {
        // any async code you want!
        const { token, userId } = getState().auth;
        const response = await fetch(`${BASE_URL}events.json/?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                imageUri,
                price,
                ownerId: userId,
                eventDate: date,
                eventTime,
                location
            })
        });

        const resData = await response.json();
        //console.log(resData);

        dispatch({
            type: CREATE_EVENT,
            eventData: {
                id: resData.name,
                title,
                description,
                imageUri,
                price,
                ownerId: userId,
                date,
                eventTime,
                location
            }
        });
    }
}

export const updateProduct = (id, title, description, imageUrl) => {
    return async (dispatch, getState) => {
        // any async code you want!
        const token = getState().auth.token;
        const response = await fetch(`${BASE_URL}products/${id}.json?auth=${token}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                imageUrl,
            })
        });
        //console.log(response);

        if(!response.ok){
            throw new Error('Something went wrong!')
        }

        dispatch({
            type: UPDATE_EVENT,
            pid: id,
            productData: {
                title,
                description,
                imageUrl,
            }
        });
    }
}