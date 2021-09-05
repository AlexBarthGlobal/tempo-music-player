






const initialState = {
    screenInfo: {}
};


export default function screenReducer (state = initialState, action) {
    switch (action.type) {
        // case FETCH_COLLECTIONS_AND_SESSIONS:
        //     return {
        //         ...state,
        //         collections: {
        //             ...action.data
        //         }
        //     };
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