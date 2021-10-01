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
const LOAD_SESSION_AND_SESSIONSONGS = 'LOAD_SESSION_AND_SESSIONSONGS'
const SET_CURRENT_SONG = 'SET_CURRENT_SONG'
const CLEAR_SESSIONS = 'CLEAR_SESSIONS'
const CREATE_COLLECTION = 'CREATE_COLLECTION'
const CLEAR_ACTIVE_SESSION = 'CLEAR_ACTIVE_SESSION'
const DISPATCH_SEARCHED_SONGS = 'DISPATCH_SEARCHED_SONGS'
const ADD_SONG_TO_COLLECTION = 'ADD_SONG_TO_COLLECTION'

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

const updateNewBPM = (data) => ({
    type: UPDATE_NEW_BPM,
    data
})

const popOneFromActiveSession = () => ({
    type: POP_ONE_FROM_ACTIVE_SESSION
})

const dispatchLoadSessionAndSessionSongs = (sessionAndSessionSongs) => ({
    type: LOAD_SESSION_AND_SESSIONSONGS,
    sessionAndSessionSongs
})

const dispatchSetCurrentSong = (song) => ({
    type: SET_CURRENT_SONG,
    song
})

const clearSessions = () => ({
    type: CLEAR_SESSIONS
})

const clearActiveSession = () => ({
    type: CLEAR_ACTIVE_SESSION
})

const createCollection = (newCollection) => ({
    type: CREATE_COLLECTION,
    newCollection
})

const dispatchSearchedSongs = (searchedSongs) => ({
    type: DISPATCH_SEARCHED_SONGS,
    searchedSongs
});

const addSongToCollection = (addedSongAndCollectionId) => ({
    type: ADD_SONG_TO_COLLECTION,
    addedSongAndCollectionId
});

export const createCollectionThunk = (collectionName, collectionArtURL) => {
    return async dispatch => {
        try {
            const newCollection = await axios.post('/api/createCollection', {data:{collectionName, collectionArtURL}})
            console.log('THIS IS THE NEW COLLECTION', newCollection)
            dispatch(createCollection(newCollection.data))
        } catch (err) {
            console.error(err)
        };
    };
};


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
        // dispatch(setFetchingStatus(true))
        try {
            const activeCollectionSongs = await axios.post('/api/fetchCurrentcollectionAndSongs', {data: activeCollectionId})
            let data = {};
            data.activeCollectionId = activeCollectionId
            data.activeCollectionSongs = new Map();
            if (activeCollectionSongs && activeCollectionSongs.data.collections[0].songs) {
                for (const song of activeCollectionSongs.data.collections[0].songs) {
                    data.activeCollectionSongs.set(song.id, song)
                };
            };
            dispatch(setActiveCollectionSongs(data))
        } catch (error) {
            console.error(error)
        } finally {
            // dispatch(setFetchingStatus(false))
        }
    };
};

export const updateSessionBpmThunk = (selectedCollectionId, newBPM) => {
    return async dispatch => {
        try {
            await axios.put('/api/updateOrCreateSessionBpm', {data:{selectedCollectionId, newBPM}});
            const data = {selectedCollectionId, newBPM}
            dispatch(updateNewBPM(data));
        } catch (err) {
            console.log(err)
        };
    };
};

export const fetchOnTempoChangeThunk = (selectedCollectionId, newBPM) => {
    return async dispatch => {
        try {
            await axios.put('/api/updateOrCreateSessionBpm', {data:{selectedCollectionId, newBPM}});
            let results = await axios.post('/api/fetchCollectionSessionAndSessionSongs', {data: selectedCollectionId})
            console.log('SESSION RESULTS', results)
            await axios.put('/api/updateUserCollectionSessionsToInactive', {data: selectedCollectionId});        
            dispatch(dispatchLoadSessionAndSessionSongs(results.data))
        } catch (err) {
            console.log(err)
        };
    };
};

export const clearSessionsThunk = () => {
    return async dispatch => {
        try {
            await axios.put('/api/clearSessions')
            dispatch(clearSessions())
        } catch (err) {
            console.log(err)
        };
    };
};

export const clearActiveSessionThunk = (collectionSessionId) => {
    return async dispatch => {
        try {
            await axios.put('/api/makeSingleSessionInactive', {data: collectionSessionId})
            dispatch(clearActiveSession())
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

export const incrementPlayIdxThunk = (sessionId) => {
    return async dispatch => {
        await axios.put('/api/incrementPlayIdx', {data: sessionId})
        dispatch(incrementPlayIdx())
    }
}

export const decrementPlayIdxThunk = (sessionId) => {
    return async dispatch => {
        await axios.put('/api/decrementPlayIdx', {data: sessionId})
        dispatch(decrementPlayIdx())
    }
}

export const setCurrentSongThunk = (song) => {
    return dispatch => {
        dispatch(dispatchSetCurrentSong(song));
    }
}

export const searchSongsThunk = (searchInput, BPMInput) => {
    return async dispatch => {
        try {
            const songs = await axios.put('/api/searchSongs', {searchInput, BPMInput});
            dispatch(dispatchSearchedSongs(songs.data));
        } catch(err) {
            console.log(err)
        };
    };
};

export const addSongToCollectionThunk = (collectionId, songId) => {
    return async dispatch => {
        try {
            const addedSong = await axios.post('/api/addSongToCollection', {collectionId, songId});
            dispatch(addSongToCollection({addedSong: addedSong.data, collectionId}));
        } catch(err) {
            console.log(err)
        };
    };
};


const initialState = {
    // musicInfo: {
    //     isFetching: true,
    // }
    isFetching: true
};

let songsCopy;
let songsInRangeCopy;
let newPlayIdx;
let collectionCopy;

export default function musicReducer (state = initialState, action) {
    switch (action.type) {
        case FETCH_COLLECTIONS_AND_SESSIONS:
            // console.log('FROM MUSIC REDUCER', action)
            return {
                ...state,
                collections: action.data.collectionsAndSessions,
                activeSession: action.data.activeSession 
            };
        case LOAD_SESSION_AND_SESSIONSONGS:
            collectionCopy = {...state.collections}
            collectionCopy[action.sessionAndSessionSongs.collectionId].collectionSessions = [action.sessionAndSessionSongs]
            return {
                ...state,
                collections: collectionCopy,
                activeSession: action.sessionAndSessionSongs
            }
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
            state.collections[action.data.selectedCollectionId].collectionSessions[0].currBPM = action.data.newBPM
            return {
                ...state,
                activeSession: {...state.activeSession, currBPM: action.data.newBPM }
            };
        case POP_ONE_FROM_ACTIVE_SESSION:
            songsCopy = [...state.activeSession.songs];
            songsCopy.pop();
            return {
                ...state,
                activeSession: {...state.activeSession, songs: songsCopy}
            };
        // case SET_CURRENT_SONG:
        //     return {
        //         ...state,
        //         currentSong: action.song
        //     }
        case CLEAR_SESSIONS:
            collectionCopy = {...state.collections};
            for (const key in collectionCopy) {
                const currCollection = collectionCopy[key];
                currCollection.collectionSessions = []
            };
            return {
                ...state,
                activeSession: undefined,
                collections: collectionCopy
            };
        case CLEAR_ACTIVE_SESSION:
            return {
                ...state,
                activeSession: undefined
            };
        case CREATE_COLLECTION:
            action.newCollection.collectionSessions = [];
            collectionCopy = {...state.collections};
            collectionCopy[action.newCollection.id] = action.newCollection
            console.log(action.newCollection)
            return {
                ...state,
                collections: collectionCopy
            };
        case DISPATCH_SEARCHED_SONGS:
            return {
                ...state,
                searchedSongs: action.searchedSongs
            };
        case SET_FETCHING_STATUS:
            return {
                ...state,
                isFetching: action.isFetching
            };
        case ADD_SONG_TO_COLLECTION:
            console.log('Blackberry', action.addedSongAndCollectionId)
            const newSong = action.addedSongAndCollectionId.addedSong
            const collectionId = action.addedSongAndCollectionId.collectionId
            console.log('destructured')
            let originalCollectionSongs = new Map(state.collections[collectionId].songs);
            let newCollectionSongs = new Map();
            if (originalCollectionSongs.size) {
                let set = false;
                for (const [songId, song] of originalCollectionSongs) {
                    const BPM = song.BPM
                    if (set) {
                        newCollectionSongs.set(songId, song)
                        continue;
                    };
                    if (BPM >= newSong.BPM) {
                        newCollectionSongs.set(newSong.id, newSong);
                        set = true;
                    };
                    newCollectionSongs.set(songId, song)
                };
                if (!set) newCollectionSongs.set(newSong.id, newSong);
            } else newCollectionSongs.set(newSong.id, newSong);
            
            collectionCopy = {...state.collections};
            collectionCopy[collectionId].songs = newCollectionSongs
            return {
                ...state,
                collections: collectionCopy
            };
    default:
        return state
    }
}