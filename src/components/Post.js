import React from 'react'
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

import * as feedActions from "../store/actions/feedActions";


const Post = (props) => {
    const dispatch = useDispatch()
    const mainUserId = useSelector(state => state.auth.userId)
    const username = useSelector(state => state.users.users[props.ownerId].username)
    const profilePic = useSelector(state => state.users.users[props.ownerId].picture)

    const isLiked = useSelector(state => {
        return state.feed.posts[props.ownerId][props.id].likes.some(id => id === mainUserId)
    })

    return (
        <View style={ styles.container }>
            <View style={ styles.header }>
                <TouchableOpacity style={ styles.userInfo } onPress={ () => { props.onProfilePress(props.ownerId, username) } }>
                    <View style={ styles.imageContainer }>
                        { profilePic && <Image source={ { uri: profilePic } } style={ styles.profileImage } /> }
                    </View>
                    <Text style={ styles.text }>{ username }</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={ () => { props.onDialog(true) } } >
                    <MaterialCommunityIcons
                        name={ 'dots-vertical' }
                        size={ 23 }
                    /></TouchableOpacity>
            </View>

            <Image source={ { uri: props.img } } style={ styles.image } />
            <TouchableOpacity onPress={ () => { isLiked ? dispatch(feedActions.unlikePost(props.id, props.ownerId)) : dispatch(feedActions.likePost(props.id, props.ownerId)) } }
                style={ styles.icons }>
                <AntDesign
                    name={ isLiked ? 'heart' : 'hearto' }
                    size={ 25 }
                    color={ isLiked ? 'red' : 'black' }
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={ () => { props.onLikesPress(props.likes) } }>
                <Text style={ styles.text }>{ props.likesCount } likes</Text>
            </TouchableOpacity>
            <Text style={ styles.text }>{ username }: { props.txt }</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 500,
        width: '100%',
        marginVertical: 10,
        backgroundColor: 'white'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        marginHorizontal: 15,
        marginBottom: 13
    },
    userInfo: {
        alignItems: 'center',
        flexDirection: 'row',

    },
    imageContainer: {
        height: 35,
        width: 35,
        borderRadius: 100 / 2,
        borderWidth: 0.5,
        borderColor: 'grey',
        overflow: 'hidden'
    },
    profileImage: {
        height: '100%',
        width: '100%'
    },
    image: {
        height: '70%',
        width: '100%'
    },
    icons: {
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 5
    },
    text: {
        fontSize: 18,
        marginLeft: 10
    },
    dialog: {
        alignItems: 'center',
        height: 50,
        width: 300
    },
    dialogDeleteButton: {
        color: 'red'
    }
})




export default Post