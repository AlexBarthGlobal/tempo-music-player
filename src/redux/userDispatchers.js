// import {createStore, applyMiddleware} from 'redux'
// import loggerMiddleware from 'redux-logger'
// import thunkMiddleware from 'redux-thunk'
import axios from 'axios'

const GET_USER = 'GET_USER';
const SET_FETCHING_STATUS = 'SET_FETCHING_STATUS';
const LOGOUT_USER = 'LOGOUT_USER'
const ADD_SONG_TO_LISTENED = 'ADD_SONG_TO_LISTENED'
const SET_UPDATED_LISTENED = 'SET_UPDATED_LISTENED'
const SET_METRONOME_SOUND_OPTION = 'SET_METRONOME_SOUND_OPTION'
const CLEAR_INITIAL_LOGIN = 'CLEAR_INITIAL_LOGIN'
const UPGRADE_TO_USER = 'UPGRADE_TO_USER'
const SIGN_UP_STATUS_MESSAGE = 'SIGN_UP_STATUS_MESSAGE'

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

const setUpdatedListened = updatedListened => ({
  type: SET_UPDATED_LISTENED,
  updatedListened
})

const setMetronomeSoundOption = boolean => ({
  type: SET_METRONOME_SOUND_OPTION,
  boolean
})

const clearInitialLogin = () => ({
  type: CLEAR_INITIAL_LOGIN
})

const upgradeToUser = (upgradedUserAndMessage) => ({
  type: UPGRADE_TO_USER,
  upgradedUserAndMessage
})

const signUpStatusMessage = (signUpStatusMessage) => ({
  type: SIGN_UP_STATUS_MESSAGE,
  signUpStatusMessage
})

export const fetchUser = () => {
  return async dispatch => {
    dispatch(setFetchingStatus(true))
    try {
      const response = await axios.get('/auth/me')
      const listenedSongs = {};
      if (response.data.listened) {
        for (const song of response.data.listened.songs) {
          delete song.listenedSongs
          listenedSongs[song.id] = song
          };
      };
      response.data.listened.songs = listenedSongs;
      dispatch(gotMe(response.data))
    } catch (error) {
      console.log(error)
    } finally {
      dispatch(setFetchingStatus(false))
    }
  }
};

export const addToListenedAndSessionThunk = (song, collectionSessionId) => {
  return async dispatch => {
      try {
        console.log(song, collectionSessionId)
          const songId = song.id
          await axios.post('/api/addSongToListenedAndSession', {data: {songId, collectionSessionId}})
          dispatch(dispatchAddSongToListened(song));
      } catch (err) {
          console.log(err)
      };
  };
};

export const logout = () => {
  return async dispatch => {
    try {
      await axios.get('/auth/logout')
      dispatch(logoutUser())
    } catch (err) {
      console.error(err)
    }
  }
}

export const clearListenedThunk = (listenedId) => {
  return async dispatch => {
    try {
      const updatedListened = await axios.put('/api/clearListened', {data: listenedId})
      updatedListened.data.songs = {};
      dispatch(setUpdatedListened(updatedListened.data)) 
    } catch (err) {
      console.log(err)
    };
  };
};

export const setMetronomeSoundOptionThunk = (boolean) => {
  return dispatch => {
      axios.put('/api/setMetronomeSoundOption', {data:{boolean}})
      dispatch(setMetronomeSoundOption(boolean))
  };
};

export const clearInitialLoginThunk = () => {
  return async dispatch => {
    try {
      axios.put('/auth/clearInitialLogin')
      dispatch(clearInitialLogin())
    } catch (err) {
      console.log(err)
    };
  };
};

export const upgradeToUserThunk = (registerUsername, registerPw) => {
  return async dispatch => {
    try {
      const upgradedUser = await axios.put('/auth/upgradeToUser', {uname: registerUsername, pw: registerPw});
      dispatch(upgradeToUser({upgradedUser: upgradedUser.data[1], message: 'Signed up successfully.'}))
    } catch (err) {
      console.log(err)
      dispatch(signUpStatusMessage('Email already exists.'))
    };
  };
};

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
    case SET_UPDATED_LISTENED:
      return {
        user: {...state.user, listened: action.updatedListened}
      };
    case SET_METRONOME_SOUND_OPTION:
      return {
        user: {...state.user, metronomeSound: action.boolean}
      };
    case CLEAR_INITIAL_LOGIN:
      return {
        user: {...state.user, initialLogin: false}
      }
    case UPGRADE_TO_USER:
      action.upgradedUserAndMessage.upgradedUser.signUpStatusMessage = action.upgradedUserAndMessage.message;
      action.upgradedUserAndMessage.upgradedUser.listened = {...state.user.listened};
      return {
        user: action.upgradedUserAndMessage.upgradedUser
      }
    case SIGN_UP_STATUS_MESSAGE:
      return {
        user: {...state.user, signUpStatusMessage: action.signUpStatusMessage}
      }
    default:
      return state
  }
}