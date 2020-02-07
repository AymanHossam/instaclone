import React, { useEffect } from 'react'
import { View, StyleSheet } from "react-native";
import * as usersActions from '../store/actions/usersActions'
import { useDispatch } from 'react-redux';


const LoadAuthScreen = (props) => {
    const dispatch = useDispatch()
    useEffect(() => {
        const LoadAuth = async () => {
            const response = await dispatch(usersActions.getAllUsers())
            props.navigation.navigate('Main')
        }
        LoadAuth()
    }, [])

    return (
        <View />
    )
}

const styles = StyleSheet.create({
    image: {
        height: 300,
        width: 400
    }
})




export default LoadAuthScreen