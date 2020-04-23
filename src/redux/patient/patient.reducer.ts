import React from 'react'
import {PatientActionTypes} from './patient.types'
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
    default:
      return state
  }
}

export default patientReducer
