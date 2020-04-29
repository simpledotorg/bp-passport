import React from 'react'
import {PatientActionTypes} from './patient.types'
import {AuthActionTypes} from '../auth/auth.types'
import {Patient} from './patient.models'

const INITIAL_STATE: {patient?: Patient} = {
  patient: undefined,
}

const patientReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PatientActionTypes.SET_PATIENT:
      return {
        ...state,
        patient: action.payload,
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
