import React from 'react'
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import { Foundation, AntDesign, FontAwesome } from '@expo/vector-icons';


import FeedScreen from './Screens/FeedScreen';
import AddScreen from './Screens/AddScreen';
import AddImgScreen from './Screens/AddImgScreen';
import ProfileScreen from './Screens/ProfileScreen';
import ViewPostScreen from './Screens/ViewPostScreen';
import ViewProfileScreen from './Screens/ViewProfileScreen';
import ViewFollowScreen from './Screens/ViewFollowScreen';
import AuthScreen from './Screens/AuthScreen';
import EditProfileScreen from './Screens/EditProfileScreen';
import HandleLogin from './HandleLogIn';

import * as authActions from './store/actions/authActions'
import { useDispatch } from 'react-redux';


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
    viewPost: ViewPostScreen,
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

const ProfileStackNavigator = createStackNavigator({
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


})

const CustomDrawerContentComponent = props => {
    const dispatch = useDispatch()

    return (
        <View style={ styles.ButtonContainer }>
            <Button
                title='Log out'
                type="outline"
                buttonStyle={ styles.Button }
                titleStyle={ styles.ButtonText }

                onPress={ () => {
                    dispatch(authActions.logOut())
                    props.navigation.navigate('Auth')
                } } />
        </View>
    )
};

const ProfileNavigator = createDrawerNavigator({
    profile: ProfileStackNavigator
}, {
    drawerPosition: 'right',
    contentComponent: CustomDrawerContentComponent,
    drawerType: 'slide',
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
    autoLogin: HandleLogin,
    Auth: AuthScreen,
    Main: mainNavigator
})

const styles = StyleSheet.create({
    ButtonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    Button: {
        borderTopColor: 'grey',
    },
    ButtonText: {
        color: 'black',
        fontSize: 17
    },
})

export default createAppContainer(authNavigator)