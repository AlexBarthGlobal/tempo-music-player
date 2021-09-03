import { combineReducers } from 'redux'
import userReducer from './isLogged'
import collectionReducer from './collections'

const appReducer = combineReducers({
  userReducer,
  collectionReducer
})

export default appReducer