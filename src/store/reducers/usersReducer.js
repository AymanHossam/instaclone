import { GET_USER, FOLLOW_USER, GET_USER_POSTS, GET_ALL_USERS, UPDATE_INFO, UPDATE_PROFILE_PIC } from "../actions/usersActions"
import users from "../../dummy-data/users"
import User from "../../models/User"
import Post from "../../models/Post"



const initialValues = {
    users: {},
    posts: {}
}

export default usersReducer = (state = initialValues, action) => {
    switch (action.type) {

        case GET_USER:
            if (state.users[action.id]) {
                return state
            }
            return {
                ...state,
                users: { ...state.users, [action.id]: state.users[action.id] }
            }
        case GET_ALL_USERS:
            return {
                ...state,
                users: action.users
            }

        case GET_USER_POSTS:
            return {
                ...state,
                posts: {
                    ...state.posts,
                    [action.userId]: action.posts
                }
            }
        case UPDATE_INFO:
            let user = state.users[action.mainUserId]
            user.picture = action.imageUrl
            user.username = action.username
            user.bio = action.bio
            return {
                ...state,
                users: { ...state.users, [action.mainUserId]: user }
            }
        case UPDATE_PROFILE_PIC:
            user = state.users[action.mainUserId]
            user.picture = action.imageUrl
            return {
                ...state,
                users: { ...state.users, [action.mainUserId]: user }
            }
        case FOLLOW_USER:
            const mainUser = state.users[action.mainUserId]
            const selectedUser = state.users[action.id]
            let updatedFollowers
            let updatedFollowing
            if (!selectedUser.followers.some(id => id === action.mainUserId)) {
                updatedFollowers = [...selectedUser.followers, action.mainUserId]
                updatedFollowing = [...mainUser.following, action.id]
            } else {
                updatedFollowers = selectedUser.followers.filter(id => id !== action.mainUserId)
                updatedFollowing = mainUser.following.filter(id => id !== action.id)
            }
            const updatedUser = new User(selectedUser.id, selectedUser.email, selectedUser.username, selectedUser.picture, selectedUser.bio, selectedUser.postsCount, updatedFollowers, selectedUser.following)
            const updatedMainUser = new User(mainUser.id, mainUser.email, mainUser.username, mainUser.picture, mainUser.bio, mainUser.postsCount, mainUser.followers, updatedFollowing)
            return {
                ...state,
                users: { ...state.users, [action.id]: updatedUser, [action.mainUserId]: updatedMainUser }
            }
    }
    return state
}