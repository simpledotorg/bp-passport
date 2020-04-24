import React from 'react'
import {BloodPressureActionTypes} from './blood-pressure.types'
import {AuthActionTypes} from '../auth/auth.types'
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

const uniqueKeyForBP = (bloodPressure: BloodPressure) => {
  return (
    bloodPressure.recorded_at +
    '-' +
    (bloodPressure.offline?.valueOf() ? 'online' : 'offline')
  )
}

const mergeBloodPressures = (bloodPressures: BloodPressure[]) => {
  const byUniqueKey: {[key: string]: BloodPressure} = {}
  bloodPressures.map((bp) => {
    const key = uniqueKeyForBP(bp)
    byUniqueKey[key] = bp
  })
  return sortedBloodPressures(Object.values(byUniqueKey))
}

const bloodPressureReducer = (state = INITIAL_STATE, action) => {
  const bloodPressures: BloodPressure[] = state.bloodPressures ?? []
  const newBloodPressures: BloodPressure[] = action.payload ?? []
  const bloodPressure: BloodPressure = action.payload
  switch (action.type) {
    case BloodPressureActionTypes.MERGE_BLOOD_PRESSURES:
      return {
        ...state,
        bloodPressures: mergeBloodPressures([
          ...bloodPressures,
          ...newBloodPressures,
        ]),
      }
    case BloodPressureActionTypes.ADD_BLOOD_PRESSURE:
      return {
        ...state,
        bloodPressures: mergeBloodPressures([...bloodPressures, bloodPressure]),
      }
    case BloodPressureActionTypes.DELETE_BLOOD_PRESSURE:
      const isOfflineBP = bloodPressure.offline ?? false
      if (!isOfflineBP) {
        // No deleting the online BPs!
        return {
          ...state,
        }
      }
      const keyRemove = uniqueKeyForBP(bloodPressure)
      const bloodPressuresFiltered = bloodPressures.filter((bp) => {
        return uniqueKeyForBP(bp) !== keyRemove
      })
      return {
        ...state,
        bloodPressures: bloodPressuresFiltered,
      }
    case AuthActionTypes.LOG_OUT:
      return {
        ...INITIAL_STATE,
      }
    default:
      return state
  }
}

export default bloodPressureReducer
