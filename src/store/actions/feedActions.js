import firebase from '../../api/firebase'
import posts from "../../dummy-data/posts"
import Post from "../../models/Post"

export const ADD_POST = 'add_post'
export const UPLOAD_PROGRESS = 'upload_progress'
export const TOGGLE_LIKE = 'toggle_like'
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
    return async (dispatch) => {
        let posts
        await firebase.database().ref('posts').once('value', snapshot => {
            posts = snapshot.val() || {}
        })
        let fetchedPosts = {}
        for (let key in posts) {
            for (let post in posts[key]) {
                const likes = posts[key][post].likes ? posts[key][post].likes : []
                const addedPost = new Post(post, posts[key][post].ownerId, posts[key][post].text, posts[key][post].imageUrl, likes, posts[key][post].likesCount, posts[key][post].date)
                fetchedPosts = {
                    ...fetchedPosts,
                    [addedPost.ownerId]: { ...fetchedPosts[addedPost.ownerId], [post]: addedPost }
                }
            }
        }
        dispatch({ type: FETCH_POSTS, posts: fetchedPosts })
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


export const addPost = (txt, img) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId

        let newPostKey = (await firebase.database().ref(`posts/${userId}`).push()).key

        let uploadTask = firebase.storage().ref(`posts/${userId}/${newPostKey}.jpg`).put(await uriToBlob(img))
        uploadTask.on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            async snapshot => {
                console.log(snapshot.state)
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes);
                dispatch({ type: UPLOAD_PROGRESS, progress })
            },
            null,
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                    const postData = {
                        ownerId: userId,
                        text: txt,
                        imageUrl: downloadURL,
                        likes: [],
                        likesCount: 0,
                        date: new Date()
                    }

                    let updates = {}
                    updates[`posts/${userId}/${newPostKey}`] = postData

                    firebase.database().ref().update(updates)
                    dispatch(
                        {
                            type: UPLOAD_PROGRESS, progress: 0
                        })
                    dispatch({
                        type: ADD_POST,
                        postData: { ...postData, id: newPostKey }
                    })
                });
            }
        )

    }
}

export const likePost = (postId, ownerId) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId

        const updatedPost = await firebase.database().ref(`posts/${ownerId}/${postId}`).transaction(post => {
            if (post) {
                if (post.likes && post.likes.some(id => id === userId)) {
                } else {
                    post.likesCount++
                    if (!post.likes) {
                        post.likes = []
                    }
                    post.likes = post.likes.concat(userId)
                }
                dispatch({ type: TOGGLE_LIKE, postId, post })
            }
            return post
        })
    }
}
export const unlikePost = (postId, ownerId) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId

        await firebase.database().ref(`posts/${ownerId}/${postId}`).transaction(post => {
            if (post) {
                if (post.likes && post.likes.some(id => id === userId)) {
                    post.likesCount--
                    post.likes = post.likes.filter(id => id !== userId)
                    dispatch({ type: TOGGLE_LIKE, postId, post })
                }
            }
            return post
        })
    }
}

export const deletePost = (postId, callback) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId
        firebase.storage().ref(`posts/${userId}/${postId}.jpg`).delete()
        await firebase.database().ref(`posts/${userId}/${postId}`).remove(() => {
            dispatch({ type: DELETE_POST, postId, userId })
        })
        if (callback) {
            callback()
        }
    }
}