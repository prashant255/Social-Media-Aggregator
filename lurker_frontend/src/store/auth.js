import * as actionTypes from './actions'

const initialState = {
    jwtToken: null
};

const auth = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.AUTH_TOKEN:
            return {
                ...state,
                jwtToken: action.jwtToken
            }
        default: 
            return state;
    }
};


export default auth;