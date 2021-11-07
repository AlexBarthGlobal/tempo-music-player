const SET_PLAYING_TRUE = 'SET_PLAYING_TRUE'
const SET_PLAYING_FALSE = 'SET_PLAYING_FALSE'
const SET_VOLUME = 'SET_VOLUME'

const setPlayingTrue = () => ({
    type: SET_PLAYING_TRUE
});

const setPlayingFalse = () => ({
    type: SET_PLAYING_FALSE
});

const setVolume = (volume) => ({
    type: SET_VOLUME,
    volume
})

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

export const setVolumeThunk = (volume) => {
    return dispatch => {
        dispatch(setVolume(volume))
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
        case SET_VOLUME:
            return {
                ...state,
                volume: action.volume
            }
        default:
            return state
    };
};