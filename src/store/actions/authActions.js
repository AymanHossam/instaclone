import { AsyncStorage } from "react-native";
import firebase from '../../api/firebase'

export const SIGN = 'sign'
export const LOG_OUT = 'log_out'


export const authenticate = (userId) => {
    return dispatch => {
        dispatch({ type: SIGN, userId })
    }
}

export const logOut = () => {
    return async dispatch => {
        await firebase.auth().signOut()
        AsyncStorage.removeItem('userData')
        dispatch({ type: LOG_OUT })
    }
}

export const signup = (username, email, password) => {
    return async dispatch => {

        await firebase.auth().createUserWithEmailAndPassword(email, password)

        firebase.auth().onAuthStateChanged(async user => {
            if (user) {
                // User is signed in.
                var email = user.email
                var uid = user.uid
                // ...

                await firebase.database().ref('users/' + uid).set({
                    id: uid,
                    username: username,
                    email: email,
                    bio: "Your bio",
                });

                dispatch(authenticate(uid));
                saveDataToStorage(uid)
            }
        });
    }
}

export const login = (email, password) => {
    return async dispatch => {
        await firebase.auth().signInWithEmailAndPassword(email, password)
        firebase.auth().onAuthStateChanged(async user => {
            if (user) {
                // User is signed in.
                console.log('logged')
                var uid = user.uid

                // ...


                dispatch(authenticate(uid));
                saveDataToStorage(uid)
            }
        });
    };
};

const saveDataToStorage = (userId) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        userId,
        //expiryDate: expiryDate.toISOString()
    }))
}



