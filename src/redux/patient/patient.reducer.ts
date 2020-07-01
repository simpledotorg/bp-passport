import {PatientActionTypes} from './patient.types'
import {AuthActionTypes} from '../auth/auth.types'
import {Patient} from './patient.models'

const INITIAL_STATE: {
  patient?: Patient
  locale?: string
  hasReviewed?: boolean
  normalBpBsCount?: number
} = {
  patient: undefined,
  locale: undefined,
  hasReviewed: false,
  normalBpBsCount: 0,
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
    case PatientActionTypes.INCREMENT_NORMAL_BP_BS_COUNT:
      return {
        ...state,
        // normalBpBsCount: 0,
        // hasReviewed: false,
        normalBpBsCount: state.normalBpBsCount + action.payload,
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
