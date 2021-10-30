const SET_PLAYING_TRUE = 'SET_PLAYING_TRUE'
const SET_PLAYING_FALSE = 'SET_PLAYING_FALSE'

const setPlayingTrue = () => ({
    type: SET_PLAYING_TRUE
});

const setPlayingFalse= () => ({
    type: SET_PLAYING_FALSE
});

export const setPlayingTrueThunk = () => {
    return dispatch => {
        dispatch(setPlayingTrue());
    };
};

export const setPlayingFalseThunk = () => {
    return dispatch => {
        dispatch(setPlayingFalse());
    };
};

const initialState = {
    playing: false
};

export default function playerReducer (state = initialState, action) {
    switch (action.type) {
        case SET_PLAYING_TRUE:
            return {
                ...state,
                playing: true
            };
        case SET_PLAYING_FALSE:
            return {
                ...state,
                playing: false
            };
        default:
            return state
    };
};