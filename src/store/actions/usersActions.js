import User from "../../models/User"

export const GET_USER_POSTS = 'get_user_posts'
export const FOLLOW_USER = 'follow_user'
export const GET_USER = 'get_user'
export const GET_ALL_USERS = 'get_all_users'
export const UPDATE_INFO = 'update_info'



export const getUser = (id) => {
    return (dispatch, getState) => {
        dispatch({ type: GET_USER, id })
    }
}
export const getUserPosts = (userId) => {
    return async (dispatch, getState) => {
        const response = await fetch(`https://instaclone-c4517.firebaseio.com//posts/${userId}.json`)
        const resData = await response.json()
        dispatch({ type: GET_USER_POSTS, userId, posts: resData })
    }
}
export const getAllUsers = (id) => {
    return async (dispatch, getState) => {
        const response = await fetch(`https://instaclone-c4517.firebaseio.com//users.json`)
        const resData = await response.json()
        let allUsers = {}
        for (let key in resData) {
            const imageUrl = resData[key].imageUrl ? resData[key].imageUrl : null
            const bio = resData[key].bio ? resData[key].bio : null
            const postsCount = resData[key].postsCount ? resData[key].postsCount : 0
            const followers = resData[key].followers ? resData[key].followers : []
            const following = resData[key].following ? resData[key].following : []
            const newUser = new User(
                resData[key].id,
                resData[key].email,
                resData[key].username,
                imageUrl,
                bio,
                postsCount,
                followers,
                following)
            allUsers = { ...allUsers, [newUser.id]: newUser }
        }
        await dispatch({ type: GET_ALL_USERS, users: allUsers })
    }
}
export const updateProfilePic = (imageUrl) => {
    return async (dispatch, getState) => {
        const mainUserId = getState().auth.userId
        const token = getState().auth.token
        const response = await fetch(`https://instaclone-c4517.firebaseio.com//users/${mainUserId}/imageUrl.json?auth=${token}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    imageUrl
                )
            })
    }
}
export const updateUserInfo = (imageUrl, username, bio) => {
    return async (dispatch, getState) => {
        const mainUserId = getState().auth.userId
        const token = getState().auth.token
        const mainUser = getState().users.users[mainUserId]
        let response
        if (mainUser.picture !== imageUrl) {
            response = await fetch(`https://instaclone-c4517.firebaseio.com//users/${mainUserId}/imageUrl.json?auth=${token}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        imageUrl
                    )
                })
        }
        if (mainUser.username !== username) {
            response = await fetch(`https://instaclone-c4517.firebaseio.com//users/${mainUserId}/username.json?auth=${token}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        username
                    )
                })
        }
        if (mainUser.bio !== bio) {
            response = await fetch(`https://instaclone-c4517.firebaseio.com//users/${mainUserId}/bio.json?auth=${token}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        bio
                    )
                })
        }
        dispatch({ type: UPDATE_INFO, mainUserId, imageUrl, username, bio })
    }
}

export const followUser = (selectedUserId) => {
    return async (dispatch, getState) => {
        const mainUserId = getState().auth.userId
        const token = getState().auth.token

        dispatch({ type: FOLLOW_USER, id: selectedUserId, mainUserId })

        let response = await fetch(`https://instaclone-c4517.firebaseio.com//users/${selectedUserId}/followers.json`)
        let resData = await response.json()
        const selectedUserFollowers = resData ? resData : []

        response = await fetch(`https://instaclone-c4517.firebaseio.com//users/${mainUserId}/following.json`)
        resData = await response.json()
        const mainUserFollowing = resData ? resData : []

        let updatedSelectedUserFollowers
        let updatedMainUserFollowing

        if (!selectedUserFollowers.some(id => id === mainUserId)) {
            updatedSelectedUserFollowers = [...selectedUserFollowers, mainUserId]
            updatedMainUserFollowing = [...mainUserFollowing, selectedUserId]
        } else {
            updatedSelectedUserFollowers = selectedUserFollowers.filter(id => id !== mainUserId)
            updatedMainUserFollowing = mainUserFollowing.filter(id => id !== selectedUserId)
        }

        await fetch(`https://instaclone-c4517.firebaseio.com//users/${selectedUserId}/followers.json?auth=${token}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    updatedSelectedUserFollowers
                )
            })

        await fetch(`https://instaclone-c4517.firebaseio.com//users/${mainUserId}/following.json?auth=${token}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    updatedMainUserFollowing
                )
            })
    }
}