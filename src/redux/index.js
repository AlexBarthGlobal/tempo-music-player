import { combineReducers } from 'redux'
import userReducer from './isLogged'

const appReducer = combineReducers({
  userReducer
})

export default appReducer