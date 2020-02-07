import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Dialog, { DialogContent, DialogButton } from 'react-native-popup-dialog';

import * as feedActions from "../store/actions/feedActions";

import Post from "../components/Post";

const FeedScreen = (props) => {

    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)
    const [isDialogVisible, setIsDialogVisible] = useState(false)


    useEffect(() => {
        const fetch = async () => {
            setIsLoading(true)
            await dispatch(feedActions.fetchPosts()).then(
                setIsLoading(false)
            )
        }
        fetch()
    }, [dispatch])

    const posts = useSelector(state => {
        const convertedPosts = []
        for (let key in state.feed.posts) {
            for (let post in state.feed.posts[key])
                convertedPosts.push({
                    id: post,
                    ownerId: state.feed.posts[key][post].ownerId,
                    text: state.feed.posts[key][post].text,
                    img: state.feed.posts[key][post].img,
                    likes: state.feed.posts[key][post].likes,
                    likesCount: state.feed.posts[key][post].likesCount
                })
        }
        return (convertedPosts.sort((a, b) =>
            a.id > b.id ? -1 : 1
        ))
    })

    const onProfilePressHandler = (id, username) => {
        props.navigation.navigate('viewProfile', { id, username })
    }
    const onLikesPressHandler = likes => {
        props.navigation.navigate('viewFollow', { list: likes })
    }

    if (isLoading) {
        return (
            <View>

            </View>
        )
    }
    if (!isLoading) {
        return (
            <View style={ styles.container }>
                <Dialog
                    visible={ isDialogVisible }
                    onTouchOutside={ () => {
                        setIsDialogVisible(false)
                    } }
                    dialogStyle={ styles.dialog }
                >
                    <DialogContent >
                        <View style={ styles.dialog }>
                            <DialogButton
                                text="Test"
                                onPress={ () => { } }
                            />

                        </View>
                    </DialogContent>
                </Dialog>
                <FlatList
                    data={ posts }
                    keyExtractor={ post => post.id }
                    renderItem={ ({ item }) => {
                        return <View>
                            <Post
                                id={ item.id }
                                ownerId={ item.ownerId }
                                likes={ item.likes }
                                txt={ item.text }
                                img={ item.img }
                                likesCount={ item.likesCount }
                                onProfilePress={ onProfilePressHandler }
                                onLikesPress={ onLikesPressHandler }
                                onDialog={ setIsDialogVisible } />
                        </View>
                    } }
                ></FlatList>
            </View>
        )
    }
}

FeedScreen.navigationOptions = {
    title: 'Instaclone'
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    },
    user: {
        flexDirection: 'row'
    },
    input: {
        width: 200
    },
    dialog: {
        alignItems: 'center',
        height: 50,
        width: 300
    }
})


export default FeedScreen