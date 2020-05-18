import React from 'react'
import {BloodSugarActionTypes} from './blood-sugar.types'
import {AuthActionTypes} from '../auth/auth.types'
import {BloodSugar} from './blood-sugar.models'
import {isBefore} from 'date-fns'

const INITIAL_STATE: {bloodSugars?: BloodSugar[]} = {
  bloodSugars: undefined,
}

const sortedBloodSugars = (bloodSugars: BloodSugar[]) => {
  const pure = [...bloodSugars]
  pure.sort((a: BloodSugar, b: BloodSugar) => {
    return isBefore(new Date(a.recorded_at), new Date(b.recorded_at)) ? 1 : -1
  })
  return pure
}

const uniqueKeyForBS = (bloodSugar: BloodSugar) => {
  return (
    bloodSugar.recorded_at +
    '-' +
    (bloodSugar.offline?.valueOf() ? 'online' : 'offline')
  )
}

const mergeBloodSugars = (bloodSugars: BloodSugar[]) => {
  const byUniqueKey: {[key: string]: BloodSugar} = {}
  bloodSugars.map((bs) => {
    const key = uniqueKeyForBS(bs)
    byUniqueKey[key] = bs
  })
  return sortedBloodSugars(Object.values(byUniqueKey))
}

const bloodSugarReducer = (state = INITIAL_STATE, action) => {
  const bloodSugars: BloodSugar[] = state.bloodSugars ?? []
  const newBloodSugars: BloodSugar[] = action.payload ?? []
  const bloodSugar: BloodSugar = action.payload
  switch (action.type) {
    case BloodSugarActionTypes.MERGE_BLOOD_SUGARS:
      return {
        ...state,
        bloodSugars: mergeBloodSugars([...bloodSugars, ...newBloodSugars]),
      }
    case BloodSugarActionTypes.ADD_BLOOD_SUGARS:
      return {
        ...state,
        bloodSugars: mergeBloodSugars([...bloodSugars, bloodSugar]),
      }
    case BloodSugarActionTypes.DELETE_BLOOD_SUGARS:
      const isOfflineBS = bloodSugar.offline ?? false
      if (!isOfflineBS) {
        // No deleting the online BSs!
        return {
          ...state,
        }
      }
      const keyRemove = uniqueKeyForBS(bloodSugar)
      const bloodSugarsFiltered = bloodSugars.filter((bs) => {
        return uniqueKeyForBS(bs) !== keyRemove
      })
      return {
        ...state,
        bloodSugars: bloodSugarsFiltered,
      }
    case AuthActionTypes.LOG_OUT:
      return {
        ...INITIAL_STATE,
      }
    default:
      return state
  }
}

export default bloodSugarReducer
