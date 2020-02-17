import { ADD_POST, UPLOAD_PROGRESS, GET_POSTS, FETCH_POSTS, DELETE_POST, TOGGLE_LIKE } from "../actions/feedActions"
import Post from "../../models/Post"


const initialValues = {
    posts: {},
    uploadProgress: 0
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
            const newPost = new Post(post.id, post.ownerId, post.text, post.imageUrl, post.likes, post.likesCount, post.date)
            return {
                ...state,
                posts: {
                    ...state.posts,
                    [post.ownerId]: { ...state.posts[post.ownerId], [post.id]: newPost }
                }
            }
        case UPLOAD_PROGRESS:
            return {
                ...state,
                uploadProgress: action.progress
            }
        case TOGGLE_LIKE:

            return {
                ...state,
                posts: {
                    ...state.posts,
                    [action.post.ownerId]: { ...state.posts[action.post.ownerId], [action.postId]: action.post }
                }
            }

        case DELETE_POST:
            const updatedPosts = { ...state.posts }
            delete updatedPosts[action.userId][action.postId]
            return {
                ...state,
                posts: updatedPosts
            }

    }
    return state
}