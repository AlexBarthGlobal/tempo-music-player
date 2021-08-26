import { combineReducers } from 'redux'
// import campusesReducer from './campuses'
// import studentsReducer from './students'
// import singleCampusReducer from './singleCampus'
// import singleStudentReducer from './singleStudent'
import userReducer from './isLogged'

const appReducer = combineReducers({
  // campuses: campusesReducer,
  // students: studentsReducer,
  // campusAndItsStudents: singleCampusReducer,
  // studentAndTheirCampus: singleStudentReducer,
  userReducer
})

export default appReducer