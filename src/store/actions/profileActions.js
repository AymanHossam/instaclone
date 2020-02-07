export const ADD_POST = 'add_post'
export const LIKE_POST = 'like_post'



export const addPost = (txt, img) => {
    return (dispatch, getState) => {
        const userId = getState().auth.userId
        dispatch({ type: ADD_POST, postData: { userId, txt, img } })
    }
}