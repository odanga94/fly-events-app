import { AsyncStorage } from 'react-native';

import { BASE_URL } from '../../constants/base-url';
const API_KEY = 'AIzaSyCJTn2PdoaO5MnBvZDCoNXmOI7MzsNrMVE';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOG_OUT = 'LOG_OUT';

let timer;

const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        token,
        userId,
        expiryDate: expirationDate.toISOString()
    }));
};

export const authenticate = (userId, token, expiryTime) => {
    return dispatch =>  {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({
            type: AUTHENTICATE,
            userId,
            token
        });
    }
}

export const signUp = (email, password, userName) => {
    return async dispatch => {
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            })
        });
        if (!response.ok) {
            const errorResData = await response.json();
            //console.log(errorResData);
            const errorMessage = errorResData.error.message;
            let message = 'Something went wrong!';
            if (errorMessage === 'EMAIL_EXISTS') {
                message = 'This email is already in use';
            } else if (errorMessage === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
                message = errorMessage;
            } else if (errorMessage === 'WEAK_PASSWORD : Password should be at least 6 characters') {
                message = 'Password should be at least 6 characters long';
            }
            throw new Error(message);
        }

        const resData = await response.json();
        try {
            await fetch(`${BASE_URL}users/${resData.localId}.json/?auth=${resData.idToken}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userName
                })
            });
        } catch (err) {
            throw new Error('Something went wrong updating your user name but you can still log in with your email and password');
        }
        //console.log(resData);
        dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000));
        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    }
}

export const logIn = (email, password) => {
    return async dispatch => {
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            })
        });
        if (!response.ok) {
            const errorResData = await response.json();
            const errorMessage = errorResData.error.message;
            let message = 'Something went wrong!';
            if (errorMessage === 'EMAIL_NOT_FOUND') {
                message = 'This email could not be found';
            } else if (errorMessage === 'INVALID_PASSWORD') {
                message = 'This password is incorrect';
            }
            throw new Error(message);
        }

        const resData = await response.json();
        const postUserName = 
        //console.log(resData);
        dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000));
        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    }
}

export const logOut = () => {
    return async dispatch => {
        if (timer) {
            clearTimeout(timer);
        }
        await AsyncStorage.removeItem('userData');
        dispatch({
            type: LOG_OUT
        })
    }
}

const setLogoutTimer = expirationTime => {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logOut());
        }, expirationTime)
    }
}