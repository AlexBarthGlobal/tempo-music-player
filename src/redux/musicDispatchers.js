import axios from 'axios'

const FETCH_COLLECTIONS_AND_SESSIONS = 'FETCH_COLLECTIONS_AND_SESSIONS';
const SET_FETCHING_STATUS = 'SET_FETCHING_STATUS';
const SET_ACTIVE_COLLECTION_SONGS = 'SET_ACTIVE_COLLECTIONS_SONGS'
const ADD_SONGS_IN_RANGE = 'ADD_SONGS_IN_RANGE'
const ENQUEUE_SONG_INITIAL = 'ENQUEUE_SONG_INITIAL'
const ENQUEUE_SONG = 'ENQUEUE_SONG'
const INCREMENT_PLAY_IDX = 'INCREMENT_PLAY_IDX'
const DECREMENT_PLAY_IDX = 'DECREMENT_PLAY_IDX'
const UPDATE_NEW_BPM = 'UPDATE_NEW_BPM'
const POP_ONE_FROM_ACTIVE_SESSION = 'POP_ONE_FROM_ACTIVE_SESSION'

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
});

const addSongsInRange = songs => ({
    type: ADD_SONGS_IN_RANGE,
    songs
});

const enqueueSongInitial = () => ({
    type: ENQUEUE_SONG_INITIAL
})

const enqueueSong = () => ({
    type: ENQUEUE_SONG
})

const incrementPlayIdx = () => ({
    type: INCREMENT_PLAY_IDX
})

const decrementPlayIdx = () => ({
    type: DECREMENT_PLAY_IDX
})

const updateNewBPM = (newBPM) => ({
    type: UPDATE_NEW_BPM,
    newBPM
})

const popOneFromActiveSession = () => ({
    type: POP_ONE_FROM_ACTIVE_SESSION
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
                if (collection.collectionSessions.length) {
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
    };
};

export const updateSessionBpmThunk = (selectedCollectionId, newBPM) => {
    return async dispatch => {
        try {
            await axios.put('/api/updateOrCreateSessionBpm', {data:{selectedCollectionId, newBPM}});
            dispatch(updateNewBPM(newBPM));
        } catch (err) {
            console.log(err)
        };
    };
};

export const popOneFromActiveSessionSongsThunk = () => {
    return dispatch => {
        dispatch(popOneFromActiveSession())
    }
}

export const applySongsInRange = (songs) => {
    return dispatch => {
        dispatch(addSongsInRange(songs))
        dispatch(enqueueSongInitial())
    };
};

export const enqueueSongThunk = () => {
    return dispatch => {
        dispatch(enqueueSong())
    };
};

export const incrementPlayIdxThunk = () => {
    return dispatch => {
        dispatch(incrementPlayIdx())
    }
}

export const decrementPlayIdxThunk = () => {
    return dispatch => {
        dispatch(decrementPlayIdx())
    }
}


const initialState = {
    // musicInfo: {
    //     isFetching: true,
    // }
    isFetching: true
};

let songsCopy;
let songsInRangeCopy;
let newPlayIdx;

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
            };
        case ADD_SONGS_IN_RANGE:
            return {
                ...state,
                activeSession: {...state.activeSession, songsInRange: action.songs}
            };
        case ENQUEUE_SONG_INITIAL:
            songsCopy = [...state.activeSession.songs];
            songsInRangeCopy = [...state.activeSession.songsInRange];
            if (songsInRangeCopy[0] && songsInRangeCopy[1]) {
                songsCopy.push(songsInRangeCopy.pop())
                songsCopy.push(songsInRangeCopy.pop())
            } else if (songsInRangeCopy[0]) {
                songsCopy.push(songsInRangeCopy.pop());
                songsCopy.push(undefined);
            } else songsCopy.push(undefined);
            
            return {
                ...state,
                activeSession: {...state.activeSession, songs: songsCopy, songsInRange: songsInRangeCopy}
            }
        case ENQUEUE_SONG:
            songsCopy = [...state.activeSession.songs];
            songsInRangeCopy = [...state.activeSession.songsInRange];
            if (songsInRangeCopy[0]) songsCopy.push(songsInRangeCopy.pop());
            else if (songsCopy[songsCopy.length-1] !== undefined) songsCopy.push(undefined);
            
            return {
                ...state,
                activeSession: {...state.activeSession, songs: songsCopy, songsInRange: songsInRangeCopy}
            }
        case INCREMENT_PLAY_IDX:
            newPlayIdx = state.activeSession.playIdx+1;
            return {
                ...state,
                activeSession: {...state.activeSession, playIdx: newPlayIdx}
            }
        case DECREMENT_PLAY_IDX:
            newPlayIdx = state.activeSession.playIdx-1;
            return {
                ...state,
                 activeSession: {...state.activeSession, playIdx: newPlayIdx}
            }
        case UPDATE_NEW_BPM:
            return {
                ...state,
                activeSession: {...state.activeSession, currBPM: action.newBPM }
            };
        case POP_ONE_FROM_ACTIVE_SESSION:
            songsCopy = [...state.activeSession.songs];
            songsCopy.pop();
            return {
                ...state,
                activeSession: {...state.activeSession, songs: songsCopy}
            };
        case SET_FETCHING_STATUS:
            return {
                ...state,
                isFetching: action.isFetching
            };
    default:
        return state
    }
}