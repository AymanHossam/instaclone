import posts from "../../dummy-data/posts"
import Post from "../../models/Post"

export const ADD_POST = 'add_post'
export const LIKE_POST = 'like_post'
export const UNLIKE_POST = 'unlike_post'
export const GET_POSTS = 'get_posts'
export const FETCH_POSTS = 'fetch_posts'
export const DELETE_POST = 'delete_post'


export const getPosts = () => {
    return (dispatch, getState) => {
        let mergedPosts = {}
        for (let key in posts) {
            mergedPosts = { ...mergedPosts, ...posts[key] }
        }
        dispatch({ type: GET_POSTS, posts: mergedPosts })
    }
}
export const fetchPosts = () => {
    return async (dispatch, getState) => {
        const response = await fetch(`https://instaclone-c4517.firebaseio.com//posts.json`)
        const resData = await response.json()
        let fetchedPosts = {}
        for (let key in resData) {
            for (let post in resData[key]) {
                const likes = resData[key][post].likes ? resData[key][post].likes : []
                const addedPost = new Post(post, resData[key][post].ownerId, resData[key][post].text, resData[key][post].imageUrl, likes, resData[key][post].likesCount, resData[key][post].date)
                fetchedPosts = {
                    ...fetchedPosts,
                    [addedPost.ownerId]: { ...fetchedPosts[addedPost.ownerId], [post]: addedPost }
                }
            }
        }
        console.log(fetchedPosts)
        dispatch({ type: FETCH_POSTS, posts: fetchedPosts })
    }
}

export const addPost = (txt, img) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId
        const token = getState().auth.token
        const date = new Date()
        const response = await fetch(`https://instaclone-c4517.firebaseio.com//posts/${userId}.json?auth=${token}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        ownerId: userId,
                        text: txt,
                        imageUrl: img,
                        likes: [],
                        likesCount: 0,
                        date
                    }
                )
            })
        const resData = await response.json()
        dispatch({
            type: ADD_POST, postData: {
                id: resData.name,
                ownerId: userId,
                text: txt,
                imageUrl: img,
                likes: [],
                likesCount: 0,
                date
            }
        })
    }
}

export const likePost = (postId, ownerId) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId
        const token = getState().auth.token
        const likedPost = getState().feed.posts[ownerId][postId]
        const isLiked = likedPost.likes.findIndex(id => id === userId)

        if (isLiked === -1) {
            dispatch({ type: LIKE_POST, data: { userId, postId, ownerId } })

            let response = await fetch(`https://instaclone-c4517.firebaseio.com//posts/${likedPost.ownerId}/${postId}/likesCount.json`)
            let resData = await response.json()

            response = await fetch(`https://instaclone-c4517.firebaseio.com//posts/${likedPost.ownerId}/${postId}/likesCount.json?auth=${token}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        resData + 1
                    )
                })

            response = await fetch(`https://instaclone-c4517.firebaseio.com//posts/${likedPost.ownerId}/${postId}/likes.json`)
            resData = await response.json()
            const updatedArray = resData ? resData.concat(userId) : [userId]
            response = await fetch(`https://instaclone-c4517.firebaseio.com//posts/${likedPost.ownerId}/${postId}/likes.json?auth=${token}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        updatedArray
                    )
                })
        }
    }
}
export const unlikePost = (postId, ownerId) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId
        const token = getState().auth.token

        dispatch({ type: UNLIKE_POST, data: { userId, postId, ownerId } })

        const likedPost = getState().feed.posts[ownerId][postId]

        let response = await fetch(`https://instaclone-c4517.firebaseio.com//posts/${likedPost.ownerId}/${postId}/likesCount.json`)
        let resData = await response.json()

        response = await fetch(`https://instaclone-c4517.firebaseio.com//posts/${likedPost.ownerId}/${postId}/likesCount.json?auth=${token}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    resData - 1
                )
            })
        response = await fetch(`https://instaclone-c4517.firebaseio.com//posts/${likedPost.ownerId}/${postId}/likes.json`)
        resData = await response.json()
        const updatedArray = resData.filter(id => id !== userId)
        response = await fetch(`https://instaclone-c4517.firebaseio.com//posts/${likedPost.ownerId}/${postId}/likes.json?auth=${token}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    updatedArray
                )
            })
    }
}

export const deletePost = (postId, callback) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId
        const token = getState().auth.token


        await fetch(`https://instaclone-c4517.firebaseio.com//posts/${userId}/${postId}.json?auth=${token}`,
            {
                method: 'DELETE',
            })
        dispatch({ type: DELETE_POST, postId, userId })
        if (callback) {
            callback()
        }
    }
}