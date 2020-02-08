import React, { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import * as usersActions from "../store/actions/usersActions";
import Profile from '../components/Profile';


const ProfileScreen = (props) => {
    const dispatch = useDispatch()

    const currentUserId = useSelector(state => state.auth.userId)
    const username = useSelector(state => state.users.users[currentUserId].username)

    useEffect(() => {
        props.navigation.setParams({ name: username })
    }, [username])

    const onViewFollowHandler = (list, followSwitch) => {
        props.navigation.navigate('viewFollow', { list, followSwitch })
    }

    dispatch(usersActions.getUser(currentUserId))

    return <Profile id={ currentUserId } onViewFollow={ onViewFollowHandler } navigation={ props.navigation } />
}

ProfileScreen.navigationOptions = props => {
    const name = props.navigation.getParam('name')
    return {
        title: name
    }
}


export default ProfileScreen