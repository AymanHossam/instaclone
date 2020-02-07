import React from 'react'
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Foundation, AntDesign, FontAwesome } from '@expo/vector-icons';


import FeedScreen from './Screens/FeedScreen';
import AddScreen from './Screens/AddScreen';
import AddImgScreen from './Screens/AddImgScreen';
import ProfileScreen from './Screens/ProfileScreen';
import ViewPostScreen from './Screens/ViewPostScreen';
import ViewProfileScreen from './Screens/ViewProfileScreen';
import ViewFollowScreen from './Screens/ViewFollowScreen';
import AuthScreen from './Screens/AuthScreen';
import LoadAuthScreen from './Screens/LoadAuthScreen';
import EditProfileScreen from './Screens/EditProfileScreen';


const defNavOptions = {

    headerTitleStyle: {
        fontFamily: 'open-sans-bold',
    },
    headerBackTitleStyle: {
        fontFamily: 'open-sans'
    },


}

const FeedNavigator = createStackNavigator({
    feed: FeedScreen,
    viewProfile: ViewProfileScreen,
    viewFollow: ViewFollowScreen,
}, {
    defaultNavigationOptions: defNavOptions,
    navigationOptions: {
        tabBarIcon: tabConfig => (
            <Foundation
                name='home'
                size={ 30 }
                color={ tabConfig.tintColor }
            />
        ),
    }
})

const AddNavigator = createStackNavigator({
    add: AddScreen,
    addImg: AddImgScreen
}, {
    defaultNavigationOptions: defNavOptions,
    navigationOptions: {
        tabBarIcon: tabConfig => (
            <FontAwesome
                name='plus-square-o'
                size={ 30 }
                color={ tabConfig.tintColor }
            />
        ),
        title: ''
    }
})

const ProfileNavigator = createStackNavigator({
    profile: ProfileScreen,
    editProfile: EditProfileScreen,
    viewFollow: ViewFollowScreen,
    viewPost: ViewPostScreen,
}, {
    defaultNavigationOptions: {
        ...defNavOptions,
        headerStyle: {

            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS

        }
    },
    navigationOptions: {
        tabBarIcon: tabConfig => (
            <AntDesign
                name='user'
                size={ 30 }
                color={ tabConfig.tintColor }
            />
        ),
    }

})

const mainNavigator = createBottomTabNavigator({
    Feed: FeedNavigator,
    Add: AddNavigator,
    Profile: ProfileNavigator
}, {
    tabBarOptions: {
        activeTintColor: 'black',
        labelStyle: {
            fontFamily: 'open-sans'
        },
        showLabel: false
    },
    lazy: true,

})

const authNavigator = createSwitchNavigator({
    Auth: AuthScreen,
    LoadAuth: LoadAuthScreen,
    Main: mainNavigator
})


export default createAppContainer(authNavigator)