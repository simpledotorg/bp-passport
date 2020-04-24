import {MedicationActionTypes} from './medication.types'
import {Medication} from './medication.models'

export const mergeMedications = (medications: Medication[]) => ({
  type: MedicationActionTypes.MERGE_MEDICATIONS,
  payload: medications,
})

export const addBloodPressure = (medication: Medication) => ({
  type: MedicationActionTypes.ADD_MEDICATION,
  payload: medication,
})

export const deleteBloodPressure = (medication: Medication) => ({
  type: MedicationActionTypes.DELETE_MEDICATION,
  payload: medication,
})
