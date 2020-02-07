import { ADD_POST, LIKE_POST } from "../actions/profileActions"
import Post from "../../models/Post"


const initialValues = {
    posts: {},
    postsCount: 0
}

export default profileReducer = (state = initialValues, action) => {
    switch (action.type) {
        case ADD_POST:
            const newPost = new Post(new Date().toString(), action.postData.userId, action.postData.txt, action.postData.img, [], 0)
            return {
                ...state,
                posts: { ...state.posts, [newPost.id]: newPost }
            }


            return state
    }
    return state
}