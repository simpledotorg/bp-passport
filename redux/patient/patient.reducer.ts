import { AnyAction } from 'redux'
import { PatientActionTypes } from './patient.types'
import { AuthActionTypes } from '../auth/auth.types'
import { Patient } from './patient.models'

const INITIAL_STATE: {
  patient?: Patient
  locale?: string
  hasReviewed?: boolean
  normalBpBsCount?: number
  bloodSugarUnit?: string
} = {
  patient: undefined,
  locale: undefined,
  hasReviewed: false,
  normalBpBsCount: undefined,
  bloodSugarUnit: undefined,
}

const patientReducer = (state = INITIAL_STATE, action: AnyAction) => {
  switch (action.type) {
    case PatientActionTypes.SET_PATIENT:
      return {
        ...state,
        patient: action.payload,
      }
    case PatientActionTypes.SET_LANGUAGE:
      return {
        ...state,
        locale: action.payload,
      }
    case PatientActionTypes.SET_HAS_REVIEWED:
      return {
        ...state,
        hasReviewed: action.payload,
      }
    case PatientActionTypes.SET_NORMAL_BP_BS_COUNT:
      return {
        ...state,
        normalBpBsCount: action.payload,
      }
    case PatientActionTypes.SET_BLOOD_SUGAR_UNIT:
      return {
        ...state,
        bloodSugarUnit: action.payload,
      }
    case AuthActionTypes.LOG_OUT:
      return {
        ...INITIAL_STATE,
      }
    default:
      return state
  }
}

export default patientReducer
