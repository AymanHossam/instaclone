import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import * as usersActions from "../store/actions/usersActions";
import Profile from '../components/Profile';


const ProfileScreen = (props) => {
    const currentUserId = useSelector(state => state.auth.userId)
    const dispatch = useDispatch()

    const onViewFollowHandler = (list, followSwitch) => {
        props.navigation.navigate('viewFollow', { list, followSwitch })
    }

    dispatch(usersActions.getUser(currentUserId))

    return <Profile id={ currentUserId } onViewFollow={ onViewFollowHandler } navigation={ props.navigation } />
}

ProfileScreen.navigationOptions = props => {
    return {
        title: 'aymn'
    }
}


export default ProfileScreen