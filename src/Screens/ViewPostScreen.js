import React, { useState } from 'react'
import { View, Button, StyleSheet, Image, Text, ScrollView } from "react-native";
import Dialog, { DialogContent, DialogButton } from 'react-native-popup-dialog';

import Post from '../components/Post';
import * as feedActions from "../store/actions/feedActions";

import { useDispatch, useSelector } from 'react-redux';



const ViewPostScreen = (props) => {

    const dispatch = useDispatch()
    const id = props.navigation.getParam('id')
    const ownerId = props.navigation.getParam('ownerId')
    const selectedPost = useSelector(state => state.feed.posts[ownerId][id])
    const text = selectedPost.text
    const img = selectedPost.img
    const likesCount = selectedPost.likesCount
    const likes = selectedPost.likes

    const [isDialogVisible, setIsDialogVisible] = useState(false)

    const deletePostHandler = () => {
        setIsDialogVisible(false)
        dispatch(feedActions.deletePost(id, () => { props.navigation.navigate('profile') }))
    }
    const onLikesPressHandler = likes => {
        props.navigation.navigate('viewFollow', { list: likes })
    }

    return (
        <ScrollView style={ styles.container }>
            <Dialog
                visible={ isDialogVisible }
                onTouchOutside={ () => {
                    setIsDialogVisible(false)
                } }
                dialogStyle={ styles.dialog }
            >
                <DialogContent style={ styles.dialogContent } >
                    <DialogButton
                        text="Delete"
                        style={ styles.dialogButtons }
                        textStyle={ styles.dialogDeleteButton }
                        onPress={ () => { deletePostHandler() } }
                    />

                </DialogContent>
            </Dialog>
            <Post id={ id } ownerId={ ownerId } txt={ text } img={ img } likes={ likes } likesCount={ likesCount } onDialog={ setIsDialogVisible } onLikesPress={ onLikesPressHandler } />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    dialog: {
        alignItems: 'center',
        height: 50,
        width: 300
    },
    dialogContent: {
        flex: 1,
        width: '100%',
    },
    dialogButtons: {
        width: '100%',
        marginVertical: 7
    },
    dialogDeleteButton: {
        marginRight: 180,
        color: 'black'
    }
})




export default ViewPostScreen