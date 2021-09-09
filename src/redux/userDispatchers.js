// import {createStore, applyMiddleware} from 'redux'
// import loggerMiddleware from 'redux-logger'
// import thunkMiddleware from 'redux-thunk'
import axios from 'axios'

const GET_USER = 'GET_USER';
const SET_FETCHING_STATUS = 'SET_FETCHING_STATUS';
const LOGOUT_USER = 'LOGOUT_USER'
const ADD_SONG_TO_LISTENED = 'ADD_SONG_TO_LISTENED'

const gotMe = user => ({
  type: GET_USER,
  user
});

const logoutUser = () => ({
  type: LOGOUT_USER,
})

const setFetchingStatus = isFetching => ({
  type: SET_FETCHING_STATUS,
  isFetching
})

const dispatchAddSongToListened = song => ({
  type: ADD_SONG_TO_LISTENED,
  song
})

export const fetchUser = () => {
  return async dispatch => {
    dispatch(setFetchingStatus(true))
    try {
      const response = await axios.get('/auth/me')
      // console.log('This is response', response.data.listened)
      const listenedSongs = {};
      if (response.data.listened) {
        for (const song of response.data.listened.songs) {
          delete song.listenedSongs
          listenedSongs[song.id] = song
          };
      };
      response.data.listened.songs = listenedSongs;

      console.log('This is NEW response', listenedSongs)

      dispatch(gotMe(response.data))
    } catch (error) {
      console.error(error)
    } finally {
      dispatch(setFetchingStatus(false))
    }
  }
};

export const addToListenedAndSessionThunk = (song, collectionSessionId) => {
  return async dispatch => {
      try {
          const songId = song.id
          await axios.post('/api/addSongToListenedAndSession', {data: {songId, collectionSessionId}})
          dispatch(dispatchAddSongToListened(song));
      } catch (err) {
          console.log(err)
      };
  };
};

// export const signUp = credentials => {
//   return async dispatch => {
//     try {
//       const response = await axios.post('/auth/signup', credentials)
//       dispatch(gotMe(response.data))
//     } catch (error) {
//       console.error(error)
//     }
//   };
// }

export const logout = () => {
  return async dispatch => {
    try {
      await axios.get('/auth/logout')
      dispatch(logoutUser())
      // history.push('/login')
    } catch (err) {
      console.error(err)
    }
  }
}

// export const login = credentials => {
//   return async dispatch => {
//     try {
//       console.log('THESE ARE CREDS', credentials)
//       const response = await axios.post('/auth/login', credentials)
//       console.log('THIS IS RESPONSE', response)
//       dispatch(gotMe(response.data))
//     } catch (error) {
//       console.error(error)
//     }
//   };
// }

// export const logout = () => {
//   return async dispatch => {
//     try {
//       await axios.delete('/auth/logout')
//       dispatch(gotMe({}))
//     } catch (error) {
//       console.error(error)
//     }
//   }
// }

const initialState = {
  user: {
    isFetching: true,
  }
}
let listenedCopy;
export default function userReducer (state = initialState, action) {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        user: {
          ...action.user
        }
      }
    case SET_FETCHING_STATUS:
      return {
        ...state,
        user: {
          ...state.user,
          isFetching: action.isFetching
        }
      }
    case LOGOUT_USER:
      return {
        user: {isFetching: false}
      }
    case ADD_SONG_TO_LISTENED:
      listenedCopy = {...state.user.listened};
      listenedCopy.songs[action.song.id] = action.song;
      return {
        user: {...state.user, listened: listenedCopy}
      };
    default:
      return state
  }
}