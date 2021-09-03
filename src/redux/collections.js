import axios from 'axios'

const FETCH_COLLECTIONS_AND_SESSIONS = 'FETCH_COLLECTIONS_AND_SESSIONS';
const SET_FETCHING_STATUS = 'SET_FETCHING_STATUS';

const setFetchingStatus = isFetching => ({
    type: SET_FETCHING_STATUS,
    isFetching
})

const gotCollectionsAndSessions = data => ({
    type: FETCH_COLLECTIONS_AND_SESSIONS,
    data
});

export const fetchCollectionsAndSessions = () => {
    return async dispatch => {
        dispatch(setFetchingStatus(true))
        try {
            const response = await axios.get('/api/fetchCollectionAndSessions')
            console.log('Returned from axios', response.data.collections)
            dispatch(gotCollectionsAndSessions(response.data.collections))
        } catch (error) {
            console.error(error)
        } finally {
            dispatch(setFetchingStatus(false))
        };
    };
};

const initialState = {
    collections: {
        isFetching: true,
    }
};

export default function collectionReducer (state = initialState, action) {
    switch (action.type) {
        case FETCH_COLLECTIONS_AND_SESSIONS:
            return {
                ...state,
                collections: {
                    ...action.data
                }
            };
        case SET_FETCHING_STATUS:
            return {
                ...state,
                collections: {
                    ...state.collections,
                isFetching: action.isFetching
            }
        };
    default:
        return state
    }
}