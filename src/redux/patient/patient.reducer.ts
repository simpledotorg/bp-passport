import {PatientActionTypes} from './patient.types'
import {AuthActionTypes} from '../auth/auth.types'
import {Patient} from './patient.models'

const INITIAL_STATE: {
  patient?: Patient
  locale?: string
  hasReviewed?: boolean
  normalBpCount?: number
  normalBsCount?: number
} = {
  patient: undefined,
  locale: undefined,
  hasReviewed: false,
  normalBpCount: 0,
  normalBsCount: 0,
}

const patientReducer = (state = INITIAL_STATE, action: any) => {
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
    case PatientActionTypes.INCREMENT_NORMAL_BP_COUNT:
      return {
        ...state,
        normalBpCount: state.normalBpCount + action.payload,
      }
    case PatientActionTypes.INCREMENT_NORMAL_BS_COUNT:
      return {
        ...state,
        normalBsCount: state.normalBsCount + action.payload,
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
