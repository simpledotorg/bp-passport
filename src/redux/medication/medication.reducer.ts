import React from 'react'
import {MedicationActionTypes} from './medication.types'
import {AuthActionTypes} from '../auth/auth.types'
import {Medication} from './medication.models'
import AsyncStorage from '@react-native-community/async-storage'
import {persistReducer} from 'redux-persist'

const ALL_MEDICINE_NAMES: Medication[] = require('../../assets/data/medicines.json')

const INITIAL_STATE: {
  medications?: Medication[]
  medicationsLibrary: Medication[]
} = {
  medications: undefined,
  medicationsLibrary: ALL_MEDICINE_NAMES,
}

const sortedMedications = (medications: Medication[]) => {
  const pure = [...medications]
  return pure
}

const uniqueKey = (medication: Medication) => {
  let key = medication.name ?? ''
  key += '-' + (medication.offline?.valueOf() ? 'online' : 'offline')
  key += '-'
  key += medication.reminder?.days ?? ''
  key += '-'
  key += medication.reminder?.dayOffset ?? ''

  return key
}

const mergeMedications = (medications: Medication[]) => {
  const byUniqueKey: {[key: string]: Medication} = {}
  const newArray: Medication[] = []
  medications.map((med) => {
    const key = uniqueKey(med)
    if (!byUniqueKey[key]) {
      byUniqueKey[key] = med
      newArray.push(med)
    }
  })
  return newArray
}

const medicationReducer = (state = INITIAL_STATE, action) => {
  const medications: Medication[] = state.medications ?? []
  const newMedications: Medication[] = action.payload ?? []
  const medication: Medication = action.payload
  switch (action.type) {
    case MedicationActionTypes.MERGE_MEDICATIONS:
      return {
        ...state,
        medications: mergeMedications([...medications, ...newMedications]),
      }
    case MedicationActionTypes.ADD_OR_UPDATE_MEDICATION:
      const updatedArray = [...medications]
      const index = updatedArray.findIndex(
        (element) => uniqueKey(element) === uniqueKey(medication),
      )
      if (index > -1) {
        updatedArray.splice(index, 1, [medication])
      } else {
        updatedArray.push(medication)
      }
      return {
        ...state,
        medications: updatedArray,
      }
    case MedicationActionTypes.DELETE_MEDICATION:
      const isOfflineBP = medication.offline ?? false
      if (!isOfflineBP) {
        // No deleting the online Medications!
        return {
          ...state,
        }
      }
      const keyRemove = uniqueKey(medication)
      const medicationsFiltered = medications.filter((med) => {
        return uniqueKey(med) !== keyRemove
      })
      return {
        ...state,
        medications: medicationsFiltered,
      }
    case AuthActionTypes.LOG_OUT:
      return {
        ...INITIAL_STATE,
      }
    default:
      return state
  }
}

const persistConfig = {
  key: 'medication',
  storage: AsyncStorage,
  blacklist: ['medicationsLibrary'],
}

export default persistReducer(persistConfig, medicationReducer)
