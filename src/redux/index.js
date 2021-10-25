import { combineReducers } from 'redux'
import userReducer from './userDispatchers'
import musicReducer from './musicDispatchers'
import screenReducer from './screenDispatchers'
import playerReducer from './playerReducer'

const appReducer = combineReducers({
  userReducer,
  musicReducer,
  screenReducer,
  playerReducer
})

export default appReducer