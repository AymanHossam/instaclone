import React from 'react'
import { useDispatch } from "react-redux";
import * as usersActions from "../store/actions/usersActions";

import Profile from '../components/Profile';


const ViewProfileScreen = (props) => {
    const selectedUserId = props.navigation.getParam('id')
    const dispatch = useDispatch()

    dispatch(usersActions.getUser(selectedUserId))

    const onViewFollowHandler = (list, followSwitch) => {
        props.navigation.navigate('viewFollow', { list, followSwitch })
    }

    return <Profile id={ selectedUserId } onViewFollow={ onViewFollowHandler } navigation={ props.navigation } />
}

ViewProfileScreen.navigationOptions = props => {
    const title = props.navigation.getParam('username')
    return {
        title
    }
}


export default ViewProfileScreen