import { SET_USER, SIGN, LOG_OUT } from "../actions/authActions"

const initialValues = {
    userId: null,
    token: null
}

export default feedReducer = (state = initialValues, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                userId: action.id
            }
        case SIGN:
            return {
                token: action.token,
                userId: action.userId
            };
        case LOG_OUT:
            return initialState
    }
    return state
}