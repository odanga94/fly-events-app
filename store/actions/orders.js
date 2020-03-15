import { BASE_URL } from '../../constants/base-url';
import ENV from '../../env';
import Order from '../../models/order';

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

export const fetchOrders = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId
        try {
            const response = await fetch(`${BASE_URL}orders/${userId}.json`);

            if (!response.ok){
                //console.log(response);
                throw new Error('Something went wrong!');
            }
            const resData = await response.json();
            //console.log(resData);
            const loadedOrders = resData ? Object.keys(resData).map(key => {
                return new Order(
                    key,
                    resData[key].cartItems,
                    resData[key].totalAmount,
                    new Date(resData[key].date),
                );
            }) : [];
            loadedOrders.sort((a, b) => a.date > b.date ? -1 : 1)
            //console.log(loadedOrders);
            dispatch({
                type: SET_ORDERS,
                orders: loadedOrders
            })
        } catch (err) {
            // send to custom analytics server
            throw err;
        }  
    }
}

export const addOrder = (cartItems, totalAmount) => {
    return async (dispatch, getState) => {
        const { token, userId } = getState().auth;
        const date = new Date();
        const response = await fetch(`${BASE_URL}orders/${userId}.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cartItems,
                totalAmount,
                date: date.toISOString()
            })
        });
        if(!response.ok){
            throw new Error('Something went wrong!');
        }
        const resData = await response.json();

        const userEmailResponse = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${ENV.googleApiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idToken: token
            })
        });
        if(!userEmailResponse.ok){
            throw new Error('Something went wrong!');
        }

        const userEmailResponseData = await userEmailResponse.json();
        const userEmail = userEmailResponseData.users[0].email;

        const userNameResponse = await fetch(`${BASE_URL}users/${userId}.json`);
        if(!userNameResponse.ok){
            throw new Error('Something went wrong!');
        }

        const userNameResponseData = await userNameResponse.json();
        const userName = userNameResponseData.userName;

        await cartItems.forEach(async (cartItem) => {
            await fetch(`${BASE_URL}events/${cartItem.eventId}/attendees/${userId}.json?auth=${token}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userEmail,
                    userName,
                    noOfTickets: cartItem.quantity
                })
            })
        })
        dispatch({
            type: ADD_ORDER,
            orderData: {
                orderId: resData.name,
                items: cartItems,
                amount: totalAmount,
                date
            }
        });
    }
}