import { MedicationActionTypes } from './medication.types'
import { Medication } from './medication.models'

export const mergeMedications = (medications: Medication[]) => ({
  type: MedicationActionTypes.MERGE_MEDICATIONS,
  payload: medications,
})

export const addMedication = (medication: Medication) => ({
  type: MedicationActionTypes.ADD_MEDICATION,
  payload: medication,
})

export const updateMedication = (medication: Medication) => ({
  type: MedicationActionTypes.UPDATE_MEDICATION,
  payload: medication,
})

export const deleteMedication = (bloodPressure: Medication) => ({
  type: MedicationActionTypes.DELETE_MEDICATION,
  payload: bloodPressure,
})
