import {BloodSugarActionTypes} from './blood-sugar.types'
import {BloodSugar} from './blood-sugar.models'

export const mergeBloodSugars = (bloodSugars: BloodSugar[]) => ({
  type: BloodSugarActionTypes.MERGE_BLOOD_SUGARS,
  payload: bloodSugars,
})

export const addBloodSugar = (bloodSugar: BloodSugar) => ({
  type: BloodSugarActionTypes.ADD_BLOOD_SUGARS,
  payload: bloodSugar,
})

export const deleteBloodSugar = (bloodSugar: BloodSugar) => ({
  type: BloodSugarActionTypes.DELETE_BLOOD_SUGARS,
  payload: bloodSugar,
})
