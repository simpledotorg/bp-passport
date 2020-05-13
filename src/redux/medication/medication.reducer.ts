import React from 'react'
import {Platform} from 'react-native'
import {MedicationActionTypes} from './medication.types'
import {AuthActionTypes} from '../auth/auth.types'
import {Medication} from './medication.models'
import AsyncStorage from '@react-native-community/async-storage'
import {persistReducer} from 'redux-persist'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import PushNotificationAndroid from 'react-native-push-notification'

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
  if (medication.offline) {
    key += '-offline'
    key += '-'
    key += medication.updated_at ?? ''
  } else {
    key += '-online'
  }

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
    case MedicationActionTypes.ADD_MEDICATION:
      medication.updated_at = new Date().toISOString()

      return {
        ...state,
        medications: [...medications, medication],
      }
    case MedicationActionTypes.UPDATE_MEDICATION:
      const updatedArray = [...medications]
      const index = updatedArray.findIndex(
        (element) => uniqueKey(element) === uniqueKey(medication),
      )
      medication.updated_at = new Date().toISOString()
      if (index > -1) {
        updatedArray.splice(index, 1, medication)
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
      if (Platform.OS === 'ios') {
        PushNotificationIOS.cancelAllLocalNotifications()
      } else if (Platform.OS === 'android') {
        PushNotificationAndroid.cancelAllLocalNotifications()
      }
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
