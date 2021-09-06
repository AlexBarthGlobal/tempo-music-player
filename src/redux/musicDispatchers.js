import axios from 'axios'

const FETCH_COLLECTIONS_AND_SESSIONS = 'FETCH_COLLECTIONS_AND_SESSIONS';
const SET_FETCHING_STATUS = 'SET_FETCHING_STATUS';
const SET_ACTIVE_COLLECTION_SONGS = 'SET_ACTIVE_COLLECTIONS_SONGS'

const setFetchingStatus = isFetching => ({
    type: SET_FETCHING_STATUS,
    isFetching
})

const gotCollectionsAndSessions = data => ({
    type: FETCH_COLLECTIONS_AND_SESSIONS,
    data
});

const setActiveCollectionSongs = data => ({
    type: SET_ACTIVE_COLLECTION_SONGS,
    data
})

export const fetchCollectionsAndSessions = () => {
    return async dispatch => {
        dispatch(setFetchingStatus(true))
        try {
            const response = await axios.get('/api/fetchCollectionAndSessions')
            // console.log('FETCHED COLLECTIONS & SESSIONS', response.data)
            let activeSession;
            const collectionsObj = {};
            for (const collection of response.data.collections) {
                collectionsObj[collection.id] = collection;
                if (collection.collectionSessions) {
                    if (collection.collectionSessions[0].active === true) {
                        activeSession = collection.collectionSessions[0];
                    };
                };
            };
            response.data.collections = collectionsObj;
            // console.log('THIS IS THE ACTIVE SESSION', activeSession)
            if (activeSession) {
                // get all songs from the session descending order so you get most recent songs first
                const sessionSongs = await axios.post('/api/fetchSongsFromSession', {data: activeSession.id});
                // console.log('SESSIONSONGS THUNK', sessionSongs)
                activeSession.songs = [];
                if (sessionSongs) {
                    for (const key in sessionSongs.data.songs) {
                        activeSession.songs.push(sessionSongs.data.songs[key]);
                    }
                }
            }
            dispatch(gotCollectionsAndSessions({collectionsAndSessions: response.data.collections, activeSession}))
        } catch (error) {
            console.error(error)
        } finally {
            dispatch(setFetchingStatus(false))
        };
    };
};

export const fetchActiveCollectionSongs = (activeCollectionId) => {
    return async dispatch => {
        dispatch(setFetchingStatus(true))
        try {
            const activeCollectionSongs = await axios.post('/api/fetchCurrentcollectionAndSongs', {data: activeCollectionId})
            console.log('THESE ARE ACTIVE SONGS', activeCollectionSongs)
            let data = {};
            if (activeCollectionSongs && activeCollectionSongs.data.collections[0].songs) {
                data.activeCollectionSongs = activeCollectionSongs.data.collections[0].songs;
            } else data.activeCollectionSongs = [];
            data.activeCollectionId = activeCollectionId
            dispatch(setActiveCollectionSongs(data))
        } catch (error) {
            console.error(error)
        } finally {
            dispatch(setFetchingStatus(false))
        }
    }
}


const initialState = {
    // musicInfo: {
    //     isFetching: true,
    // }
    isFetching: true
};

export default function musicReducer (state = initialState, action) {
    switch (action.type) {
        case FETCH_COLLECTIONS_AND_SESSIONS:
            // console.log('FROM MUSIC REDUCER', action)
            return {
                ...state,
                collections: action.data.collectionsAndSessions,
                activeSession: action.data.activeSession 
            };
        case SET_ACTIVE_COLLECTION_SONGS:
            const collectionsCopy = {...state.collections}
            collectionsCopy[action.data.activeCollectionId].songs = action.data.activeCollectionSongs
            return {
                ...state,
                collections: collectionsCopy
            }
        case SET_FETCHING_STATUS:
            return {
                ...state,
                isFetching: action.isFetching
            };
    default:
        return state
    }
}