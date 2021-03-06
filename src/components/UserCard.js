import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, Image } from "react-native";
import { Button } from 'react-native-elements'
import { useSelector, useDispatch } from "react-redux";
import * as usersActions from "../store/actions/usersActions";

const UserCard = (props) => {
    const [isFollowing, setIsFollowing] = useState(false)
    const [isMainUser, setIsMainUser] = useState(false)
    const dispatch = useDispatch()
    const users = useSelector(state => state.users.users)

    const mainUserId = useSelector(state => state.auth.userId)
    const mainUser = users[mainUserId]

    useEffect(() => {
        if (mainUser.following.some(id => id === props.id)) {
            setIsFollowing(true)
        } else {
            setIsFollowing(false)
        }

        if (mainUserId === props.id) {
            setIsMainUser(true)
        }
    }, [props.id, mainUser.following])

    return (
        <View>
            <View style={ styles.userCard }>
                <View style={ styles.user }>
                    <View style={ styles.imageContainer }>
                        <Image source={ { uri: users[props.id].picture } } style={ styles.image } />
                    </View>
                    <Text>{ users[props.id].username }</Text>
                </View>
                { !isMainUser && (isFollowing ? <Button title={ 'Following' } buttonStyle={ styles.button } titleStyle={ { color: 'black', fontSize: 14 } } type='outline' onPress={ () => dispatch(usersActions.followUser(props.id)) } /> :
                    <Button title={ 'Follow' } buttonStyle={ styles.button } titleStyle={ { fontSize: 14 } } onPress={ () => dispatch(usersActions.followUser(props.id)) } />)
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    userCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 20,
        marginBottom: 0,
        borderBottomWidth: 0.2,
        borderBottomColor: 'grey',
        paddingBottom: 15
    },
    user: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    imageContainer: {
        height: 80,
        width: 80,
        borderRadius: 100 / 2,
        borderWidth: 0.5,
        borderColor: 'grey',
        overflow: 'hidden',
        marginRight: 10
    },
    image: {
        height: '100%',
        width: '100%'
    },
    button: {
        height: 27,
        width: 110,
        borderColor: 'grey'
    }
})


export default UserCard



