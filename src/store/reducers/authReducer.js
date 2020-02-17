import { SIGN, LOG_OUT } from "../actions/authActions"

const initialValues = {
    userId: null,
}

export default feedReducer = (state = initialValues, action) => {
    switch (action.type) {
        case SIGN:
            return {
                userId: action.userId
            };
        case LOG_OUT:
            return initialValues
    }
    return state
}