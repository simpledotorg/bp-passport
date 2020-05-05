import {MedicationActionTypes} from './medication.types'
import {Medication} from './medication.models'

export const mergeMedications = (medications: Medication[]) => ({
  type: MedicationActionTypes.MERGE_MEDICATIONS,
  payload: medications,
})

export const addOrUpdateMedication = (medication: Medication) => ({
  type: MedicationActionTypes.ADD_OR_UPDATE_MEDICATION,
  payload: medication,
})

export const deleteMedication = (bloodPressure: Medication) => ({
  type: MedicationActionTypes.DELETE_MEDICATION,
  payload: bloodPressure,
})
