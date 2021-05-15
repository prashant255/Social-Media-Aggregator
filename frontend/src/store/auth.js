import * as actionTypes from './actions'

const initialState = {
    jwtToken: null,
    name: null
};

const auth = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.AUTH_TOKEN:
            return {
                ...state,
                jwtToken: action.jwtToken,
                name: action.name
            }
        default: 
            return state;
    }
};


export default auth;