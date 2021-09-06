// import {createStore, applyMiddleware} from 'redux'
// import loggerMiddleware from 'redux-logger'
// import thunkMiddleware from 'redux-thunk'
import axios from 'axios'

const GET_USER = 'GET_USER';
const SET_FETCHING_STATUS = 'SET_FETCHING_STATUS';
const LOGOUT_USER = 'LOGOUT_USER'

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
}

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
    default:
      return state
  }
}