import * as actionTypes from './actions'

const initialState = {
    jwtToken: null,
    name: null,
    posts: []
};

const auth = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.AUTH_TOKEN:
            return {
                ...state,
                jwtToken: action.jwtToken,
                name: action.name,
                posts: action.posts
            }
        
        case actionTypes.POSTS:
            const currentPosts = state.posts;
            currentPosts.push(action.post);
            
            return {
                ...state,
                posts: currentPosts
            }
        
        default: 
            return state;
    }
};


export default auth;