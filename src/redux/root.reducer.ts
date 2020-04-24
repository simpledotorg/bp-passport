import {combineReducers} from 'redux'

import authReducer from './auth/auth.reducer'
import patientReducer from './patient/patient.reducer'
import bloodPressureReducer from './blood-pressure/blood-pressure.reducer'
import bloodSugarReducer from './blood-sugar/blood-sugar.reducer'
import medicationReducer from './medication/medication.reducer'

export default combineReducers({
  auth: authReducer,
  patient: patientReducer,
  bloodPressure: bloodPressureReducer,
  medication: medicationReducer,
  bloodSugar: bloodSugarReducer,
})
