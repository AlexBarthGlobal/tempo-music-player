const SELECT_COLLECTION = 'SELECT_COLLECTION'
const CHANGE_SCREEN = 'CHANGE_SCREEN'
const SET_SELECTED_COLLECTION_AND_SCREEN = 'SET_SELECTED_COLLECTION_AND_SCREEN'

const setSelectedCollection = collectionId => ({
    type: SELECT_COLLECTION,
    collectionId
});

const setSelectedCollectionAndScreen = data => ({
    type: SET_SELECTED_COLLECTION_AND_SCREEN,
    data
});

const changeScreenAction = screen => ({
    type: CHANGE_SCREEN,
    screen
})

export const selectCollection = (collectionId) => {
    return dispatch => {
        console.log('FROM DISPATCHER', collectionId)
        dispatch(setSelectedCollection(collectionId))
    }
}

export const selectCollectionAndChangeScreenThunk = (collectionId, screen) => {
    return dispatch => {
        dispatch(setSelectedCollectionAndScreen({collectionId, screen}))
    };
};

export const changeScreenThunk = (screen) => {
    return dispatch => {
        dispatch(changeScreenAction(screen))
    };
};



const initialState = {
    screenStr: "Collections",
    selectedCollection: null
};


export default function screenReducer (state = initialState, action) {
    switch (action.type) {
        case SELECT_COLLECTION:
            console.log('This is action', action.collectionId)
            return {
                ...state,
                selectedCollection: action.collectionId
            };
        case CHANGE_SCREEN:
            return {
                ...state,
                screenStr: action.screen
            }
        case SET_SELECTED_COLLECTION_AND_SCREEN:
            console.log('SELECTED COLLECTION AND SCREEN', action.data)
            return {
                ...state,
                screenStr: action.data.screen,
                selectedCollection: action.data.collectionId
            }
        // case SET_FETCHING_STATUS:
        //     return {
        //         ...state,
        //         collections: {
        //             ...state.collections,
        //         isFetching: action.isFetching
        //     }
        // };
    default:
        return state
    }
}