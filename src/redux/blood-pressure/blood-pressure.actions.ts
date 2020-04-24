import {BloodPressureActionTypes} from './blood-pressure.types'
import {BloodPressure} from './blood-pressure.models'

export const mergeBloodPressures = (bloodPressures: BloodPressure[]) => ({
  type: BloodPressureActionTypes.MERGE_BLOOD_PRESSURES,
  payload: bloodPressures,
})

export const addBloodPressure = (bloodPressure: BloodPressure) => ({
  type: BloodPressureActionTypes.ADD_BLOOD_PRESSURE,
  payload: bloodPressure,
})

export const deleteBloodPressure = (bloodPressure: BloodPressure) => ({
  type: BloodPressureActionTypes.DELETE_BLOOD_PRESSURE,
  payload: bloodPressure,
})
