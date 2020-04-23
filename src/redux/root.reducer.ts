import {combineReducers} from 'redux'

import authReducer from './auth/auth.reducer'
import patientReducer from './patient/patient.reducer'

export default combineReducers({
  auth: authReducer,
  patient: patientReducer,
})
