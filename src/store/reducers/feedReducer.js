import { ADD_POST, LIKE_POST, GET_POSTS, FETCH_POSTS, DELETE_POST, UNLIKE_POST } from "../actions/feedActions"
import Post from "../../models/Post"


const initialValues = {
    posts: {}
}

export default feedReducer = (state = initialValues, action) => {
    switch (action.type) {
        case GET_POSTS:
            return {
                ...state,
                posts: action.posts
            }
        case FETCH_POSTS:
            return {
                ...state,
                posts: action.posts
            }
        case ADD_POST:
            const post = action.postData
            const newPost = new Post(post.id, post.ownerId, post.text, post.imageUrl, post.likes, post.likesCount)
            return {
                ...state,
                posts: {
                    ...state.posts,
                    [post.ownerId]: { ...state.posts[post.ownerId], [post.id]: newPost }
                }
            }

        case LIKE_POST:
            let likedPost = state.posts[action.data.ownerId][action.data.postId]

            let updatedLikes = likedPost.likes.concat(action.data.userId)
            let updatedPost = new Post(likedPost.id, likedPost.ownerId, likedPost.text, likedPost.img, updatedLikes, likedPost.likesCount + 1)
            return {
                ...state,
                posts: {
                    ...state.posts,
                    [action.data.ownerId]: { ...state.posts[updatedPost.ownerId], [updatedPost.id]: updatedPost }
                }
            }
        case UNLIKE_POST:
            likedPost = state.posts[action.data.ownerId][action.data.postId]
            updatedLikes = likedPost.likes.filter(id => id !== action.data.userId)
            console.log(updatedLikes)
            updatedPost = new Post(likedPost.id, likedPost.ownerId, likedPost.text, likedPost.img, updatedLikes, likedPost.likesCount - 1)
            return {
                ...state,
                posts: {
                    ...state.posts,
                    [action.data.ownerId]: { ...state.posts[updatedPost.ownerId], [updatedPost.id]: updatedPost }
                }
            }

        case DELETE_POST:
            const updatedPosts = { ...state.posts }
            console.log(updatedPosts === state.posts)
            delete updatedPosts[action.userId][action.postId]
            return {
                ...state,
                posts: updatedPosts
            }

    }
    return state
}