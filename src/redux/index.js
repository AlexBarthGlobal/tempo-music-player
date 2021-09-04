import { combineReducers } from 'redux'
import userReducer from './userDispatchers'
import musicReducer from './musicDispatchers'
import screenReducer from './screenDispatchers'

const appReducer = combineReducers({
  userReducer,
  musicReducer,
  screenReducer
})

export default appReducer