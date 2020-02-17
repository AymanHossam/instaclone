import firebase from '../../api/firebase'
import User from "../../models/User"

export const GET_USER_POSTS = 'get_user_posts'
export const FOLLOW_USER = 'follow_user'
export const GET_USER = 'get_user'
export const GET_ALL_USERS = 'get_all_users'
export const UPDATE_INFO = 'update_info'
export const UPDATE_PROFILE_PIC = 'update_profile_pic'


export const getUser = (id) => {
    return (dispatch) => {
        dispatch({ type: GET_USER, id })
    }
}
export const getUserPosts = (userId) => {
    return async (dispatch) => {
        let userPosts
        await firebase.database().ref('posts/' + userId).once('value', snapshot => {
            userPosts = snapshot.val() || {}
        })

        dispatch({ type: GET_USER_POSTS, userId, posts: userPosts })
    }
}
export const getAllUsers = () => {
    return async (dispatch) => {
        let users
        await firebase.database().ref('users').once('value', snapshot => {
            users = snapshot.val() || {}
        })
        let allUsers = {}
        for (let key in users) {
            const newUser = new User(
                users[key].id,
                users[key].email,
                users[key].username || 'new user',
                users[key].imageUrl || null,
                users[key].bio || null,
                users[key].postsCount || 0,
                users[key].followers || [],
                users[key].following || [])
            allUsers = { ...allUsers, [newUser.id]: newUser }
        }
        await dispatch({ type: GET_ALL_USERS, users: allUsers })
    }
}
const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            // return the blob
            resolve(xhr.response);
        };

        xhr.onerror = function () {
            // something went wrong
            reject(new Error('uriToBlob failed'));
        };
        // this helps us get a blob
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);

        xhr.send(null);
    });
}

export const updateProfilePic = (img) => {
    return async (dispatch, getState) => {
        const mainUserId = getState().auth.userId
        let uploadTask = firebase.storage().ref(`users/${mainUserId}.jpg`).put(await uriToBlob(img))
        uploadTask.on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            async snapshot => {
                console.log(snapshot.state)

            },
            null,
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then(imageUrl => {

                    let updates = {}
                    updates[`users/${mainUserId}/imageUrl`] = imageUrl
                    firebase.database().ref().update(updates)

                    dispatch({ type: UPDATE_PROFILE_PIC, imageUrl, mainUserId })
                });
            })
    }
}
export const updateUserInfo = (imageUrl, username, bio) => {
    return async (dispatch, getState) => {
        const mainUserId = getState().auth.userId
        const mainUser = getState().users.users[mainUserId]

        let updates = {}

        mainUser.picture !== imageUrl && (updates[`users/${mainUserId}/imageUrl`] = imageUrl)
        mainUser.username !== username && (updates[`users/${mainUserId}/username`] = username)
        mainUser.bio !== bio && (updates[`users/${mainUserId}/bio`] = bio)

        firebase.database().ref().update(updates)
        dispatch({ type: UPDATE_INFO, mainUserId, imageUrl, username, bio })
    }
}

export const followUser = (selectedUserId) => {
    return async (dispatch, getState) => {
        const mainUserId = getState().auth.userId

        dispatch({ type: FOLLOW_USER, id: selectedUserId, mainUserId })
        await firebase.database().ref('users').transaction(users => {
            if (users) {
                if (users[mainUserId] && users[selectedUserId]) {
                    if (users[mainUserId].following && users[mainUserId].following.some(id => id === selectedUserId)) {
                        users[mainUserId].following = users[mainUserId].following.filter(id => id !== selectedUserId)
                        users[selectedUserId].followers = users[selectedUserId].followers.filter(id => id !== mainUserId)
                    } else {
                        if (!users[mainUserId].following) {
                            users[mainUserId].following = []
                        }
                        if (!users[selectedUserId].followers) {
                            users[selectedUserId].followers = []
                        }
                        users[mainUserId].following = users[mainUserId].following.concat(selectedUserId)
                        users[selectedUserId].followers = users[selectedUserId].followers.concat(mainUserId)
                    }
                }
            }
            return users
        })

        // let selectedUserFollowers
        // let mainUserFollowing
        // await firebase.database().ref(`users/${selectedUserId}/followers`).once('value', snapshot => {
        //     selectedUserFollowers = snapshot.val() || []
        // })
        // await firebase.database().ref(`users/${mainUserId}/following`).once('value', snapshot => {
        //     mainUserFollowing = snapshot.val() || []
        // })

        // if (!selectedUserFollowers.some(id => id === mainUserId)) {
        //     selectedUserFollowers = [...selectedUserFollowers, mainUserId]
        //     mainUserFollowing = [...mainUserFollowing, selectedUserId]
        // } else {
        //     selectedUserFollowers = selectedUserFollowers.filter(id => id !== mainUserId)
        //     mainUserFollowing = mainUserFollowing.filter(id => id !== selectedUserId)
        // }

        // let updates = {}
        // updates[`users/${selectedUserId}/followers`] = selectedUserFollowers
        // updates[`users/${mainUserId}/following`] = mainUserFollowing

        // firebase.database().ref().update(updates)

    }
}