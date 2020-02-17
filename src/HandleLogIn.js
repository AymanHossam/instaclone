import React, { useEffect } from 'react'
import firebase from './api/firebase'
import { AsyncStorage, View } from 'react-native'

import * as authActions from './store/actions/authActions'
import { useDispatch } from 'react-redux'

const HandleLogin = (props) => {
    const dispatch = useDispatch()

    useEffect(() => {
        firebase.auth().onAuthStateChanged(async user => {
            if (user) {
                let savedUser = await AsyncStorage.getItem('userData')
                let { userId } = await JSON.parse(savedUser)

                dispatch(authActions.authenticate(userId))
                props.navigation.navigate('Main')
            } else {
                props.navigation.navigate('Auth')
            }
        })
    }, [])

    return <View />
}

export default HandleLogin