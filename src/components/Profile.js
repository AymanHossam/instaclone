import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Image, Text, TouchableOpacity, FlatList, Dimensions } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as usersActions from "../store/actions/usersActions";
import * as ImagePicker from 'expo-image-picker';
import { Button } from 'react-native-elements';



const Profile = (props) => {
    const dispatch = useDispatch()
    const selectedUser = useSelector(state => state.users.users[props.id])

    const [profilePic, setProfilePic] = useState(selectedUser.picture)
    const [isMainUser, setIsMainUser] = useState(false)

    const mainUserId = useSelector(state => state.auth.userId)

    const selectedUserPosts = useSelector(state => {
        const convertedPosts = []
        for (let key in state.feed.posts[props.id]) {
            convertedPosts.push({
                id: key,
                ownerId: state.feed.posts[props.id][key].ownerId,
                text: state.feed.posts[props.id][key].text,
                img: state.feed.posts[props.id][key].img,
                likes: state.feed.posts[props.id][key].likes,
                likesCount: state.feed.posts[props.id][key].likesCount
            })
        }
        return convertedPosts.sort((a, b) =>
            a.id > b.id ? 1 : -1
        )
    })
    // console.log(useSelector(state => state.users.users))

    const isFollowed = selectedUser.followers.some(id => id === mainUserId)

    useEffect(() => {

        if (mainUserId === props.id) {
            setIsMainUser(true)
        }
    }, [props.id, mainUserId])

    useEffect(() => {
        dispatch(usersActions.getUserPosts(props.id))
    }, [dispatch])

    const _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        if (!result.cancelled) {
            setProfilePic(result.uri);
            dispatch(usersActions.updateProfilePic(result.uri))
        }
    };

    return (
        <View style={ styles.container }>
            <View style={ styles.header }>
                { isMainUser ? <TouchableOpacity onPress={ _pickImage } style={ styles.imageContainer }>
                    { profilePic && <Image source={ { uri: profilePic } } style={ styles.image } /> }
                </TouchableOpacity> :
                    <View style={ styles.imageContainer }>
                        { profilePic && <Image source={ { uri: profilePic } } style={ styles.image } /> }
                    </View> }
                <View style={ styles.headerItems }>
                    <Text style={ styles.bold }>{ selectedUserPosts.length }</Text>
                    <Text>Posts</Text>
                </View>
                <TouchableOpacity style={ styles.headerItems } onPress={ () => { props.onViewFollow(selectedUser.followers, 1) } }>
                    <Text style={ styles.bold }>{ selectedUser.followers.length }</Text>
                    <Text>Followers</Text>
                </TouchableOpacity>
                <TouchableOpacity style={ styles.headerItems } onPress={ () => { props.onViewFollow(selectedUser.following, 2) } }>
                    <Text style={ styles.bold }>{ selectedUser.following.length }</Text>
                    <Text>Following</Text>
                </TouchableOpacity>
            </View>
            <Text style={ styles.bio }>{ selectedUser.bio }</Text>
            { !isMainUser ? <View style={ styles.follow } >
                <Button title={ isFollowed ? 'Unfollow' : 'Follow' } onPress={ () => dispatch(usersActions.followUser(props.id)) } />
            </View> :
                <Button title="Edit Profile"
                    type="outline"
                    buttonStyle={ styles.editButton }
                    titleStyle={ styles.editButtonText }
                    onPress={ () => { props.navigation.navigate('editProfile') } } />
            }
            <FlatList data={ selectedUserPosts } keyExtractor={ item => item } numColumns='3' renderItem={ ({ item }) => {
                return <TouchableOpacity style={ styles.postContainer } onPress={ () => { props.navigation.navigate('viewPost', { id: item.id, ownerId: item.ownerId }) } }>
                    <Image source={ { uri: item.img } } style={ styles.image } />
                </TouchableOpacity>
            } } />
        </View>
    )
}

var { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    imageContainer: {
        height: 100,
        width: 100,
        borderRadius: 100 / 2,
        borderWidth: 1,
        borderColor: 'grey',
        margin: 15,
        overflow: 'hidden'
    },
    image: {
        height: '100%',
        width: '100%'
    },
    headerItems: {
        flex: 1,
        marginRight: 15,
        alignItems: 'center'
    },
    bold: {
        fontWeight: 'bold'
    },
    bio: {
        marginHorizontal: 15,
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 30
    },
    follow: {
        marginHorizontal: 100,
        marginBottom: 10,
        borderRadius: 20,
        overflow: 'hidden'
    },
    editButton: {
        height: 30,
        marginVertical: 15,
        marginHorizontal: 10,
        borderColor: 'grey'
    },
    editButtonText: {
        color: 'black',
        fontSize: 14
    },
    postContainer: {
        borderWidth: 0.5,
        borderColor: 'grey',
        height: 130,
        width: (width - 3.5) / 3,
        margin: 0.5
    },
    text: {
        fontSize: 18,
        marginLeft: 10
    }
})




export default Profile