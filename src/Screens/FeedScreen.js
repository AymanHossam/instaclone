import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Dialog, { DialogContent, DialogButton } from 'react-native-popup-dialog';
import * as Progress from 'react-native-progress'

import * as usersActions from '../store/actions/usersActions'
import * as feedActions from "../store/actions/feedActions";

import Post from "../components/Post";

const FeedScreen = (props) => {

    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [isDialogVisible, setIsDialogVisible] = useState(false)

    const mainUserId = useSelector(state => state.auth.userId)
    const uploadProgress = useSelector(state => state.feed.uploadProgress)

    useEffect(() => {
        const fetch = () => {
            setIsLoading(true)
            dispatch(usersActions.getAllUsers()).then(
                dispatch(feedActions.fetchPosts()).then(() => {
                    setIsLoading(false)
                }
                )
            )
        }
        fetch()
    }, [dispatch])

    const onRefreshHandler = () => {
        setIsRefreshing(true)
        dispatch(feedActions.fetchPosts()).then(
            setIsRefreshing(false)
        )
    }

    const posts = useSelector(state => {
        const convertedPosts = []
        for (let key in state.feed.posts) {
            for (let post in state.feed.posts[key])
                convertedPosts.push({
                    id: post,
                    ownerId: state.feed.posts[key][post].ownerId,
                    text: state.feed.posts[key][post].text,
                    img: state.feed.posts[key][post].imageUrl,
                    likes: state.feed.posts[key][post].likes,
                    likesCount: state.feed.posts[key][post].likesCount,
                    date: state.feed.posts[key][post].date
                })
        }
        return (convertedPosts.sort((a, b) =>
            a.id > b.id ? -1 : 1
        ))
    })

    const onProfilePressHandler = (id, username) => {
        if (id === mainUserId) {
            props.navigation.navigate('Profile')
        } else {
            props.navigation.navigate('viewProfile', { id, username })
        }
    }
    const onLikesPressHandler = likes => {
        props.navigation.navigate('viewFollow', { list: likes })
    }

    if (isLoading) {
        return (
            <View style={ styles.loading }>
                <ActivityIndicator size='large' />
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
                    ListHeaderComponent={ () => {
                        return uploadProgress ? <View style={ styles.progressContainer }>
                            <Progress.Bar progress={ uploadProgress } width={ null } useNativeDriver style={ styles.progress } />
                        </View> : null
                    } }
                    data={ posts }
                    keyExtractor={ post => post.id }
                    onRefresh={ onRefreshHandler }
                    refreshing={ isRefreshing }
                    renderItem={ ({ item }) => {
                        return <View>
                            <Post
                                id={ item.id }
                                ownerId={ item.ownerId }
                                likes={ item.likes }
                                txt={ item.text }
                                img={ item.img }
                                likesCount={ item.likesCount }
                                date={ item.date }
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
    loading: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    progressContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20
    },
    progress: {
        width: '85%',
    },
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