import { combineReducers } from 'redux'
import userReducer from './isLogged'
import musicInfoReducer from './musicInfoReducer'
import screenReducer from './screens'

const appReducer = combineReducers({
  userReducer,
  musicInfoReducer,
  screenReducer
})

export default appReducer