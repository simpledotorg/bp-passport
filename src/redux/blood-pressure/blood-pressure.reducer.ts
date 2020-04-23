import React from 'react'
import {BloodPressureActionTypes} from './blood-pressure.types'
import {BloodPressure} from './blood-pressure.models'
import {isBefore} from 'date-fns'

const INITIAL_STATE: {bloodPressures?: BloodPressure[]} = {
  bloodPressures: undefined,
}

const sortedBloodPressures = (bloodPressures: BloodPressure[]) => {
  const pure = [...bloodPressures]
  pure.sort((a: BloodPressure, b: BloodPressure) => {
    return isBefore(new Date(a.recorded_at), new Date(b.recorded_at)) ? 1 : -1
  })
  return pure
}

const bloodPressureReducer = (state = INITIAL_STATE, action) => {
  let bloodPressures: BloodPressure[] = []
  switch (action.type) {
    case BloodPressureActionTypes.MERGE_BLOOD_PRESSURES:
      bloodPressures = action.payload

      console.log('todo, merge blood pressures', action.payload)
      // todo perform the merge...
      return {
        ...state,
        bloodPressures: sortedBloodPressures(bloodPressures),
      }
    default:
      return state
  }
}

export default bloodPressureReducer
