export const SET_USER = 'set_user'
export const SIGN = 'sign'
export const LOG_OUT = 'log_out'

import { AsyncStorage } from "react-native";

export const setUser = id => {
    console.log('Current User: ' + id)
    return { type: SET_USER, id }
}


export const authenticate = (token, userId, time) => {
    return dispatch => {
        dispatch(setLogoutTimer(time))
        dispatch({ type: SIGN, token, userId })
    }
}

export const logOut = () => {
    return async dispatch => {
        clearLogoutTimer()
        AsyncStorage.removeItem('userData')
        dispatch({ type: LOG_OUT })
    }
}

export const signup = (userName, email, password) => {
    return async dispatch => {
        let response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDc8wfFinp8dGX-YMfFnDgXxtjXVXSUz1M',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        );


        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Something went wrong!';
            if (errorId === 'EMAIL_EXISTS') {
                message = 'This email exists already!';
            }
            throw new Error(message);
        }

        const resData = await response.json();
        const expiryDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000)

        response = await fetch(
            `https://instaclone-c4517.firebaseio.com//users/${resData.localId}.json?auth=${resData.idToken}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: resData.localId,
                    email: email,
                    username: userName,
                    imageUrl: null,
                    bio: "Your bio",
                    postsCount: null,
                    followers: null,
                    following: null,
                    password: password,
                })
            }
        );

        dispatch(authenticate(resData.idToken, resData.localId, parseInt(resData.expiresIn) * 1000));
        saveDataToStorage(resData.localId, resData.idToken, expiryDate)
    }
}

export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDc8wfFinp8dGX-YMfFnDgXxtjXVXSUz1M',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        );

        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Something went wrong!';
            if (errorId === 'EMAIL_NOT_FOUND') {
                message = 'This email could not be found!';
            } else if (errorId === 'INVALID_PASSWORD') {
                message = 'This password is not valid!';
            }
            throw new Error(message);
        }

        const resData = await response.json();
        const expiryDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000)
        dispatch(authenticate(resData.idToken, resData.localId, parseInt(resData.expiresIn) * 1000));
        saveDataToStorage(resData.localId, resData.idToken, expiryDate)
    };
};
let timer

const clearLogoutTimer = () => {
    if (timer) {
        clearTimeout(timer)
    }
}
const setLogoutTimer = expirationTime => {
    return dispatch => {
        timer = setTimeout(() => {
            //dispatch(logOut())
        }, expirationTime)
    }
}

const saveDataToStorage = (userId, token, expiryDate) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        userId,
        token,
        expiryDate: expiryDate.toISOString()
    }))
}



