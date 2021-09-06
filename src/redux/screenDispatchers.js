const SELECT_COLLECTION = 'SELECT_COLLECTION'
const CHANGE_SCREEN = 'CHANGE_SCREEN'

const setSelectedCollection = collectionId => ({
    type: SELECT_COLLECTION,
    collectionId
})

export const selectCollection = (collectionId) => {
    return dispatch => {
        console.log('FROM DISPATCHER', collectionId)
        dispatch(setSelectedCollection(collectionId))
    }
}







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
                screen: {
                    ...action.data.screen
                }
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