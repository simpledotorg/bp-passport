import axios from 'axios'

import {MOCK_API_ENDPOINT} from './constants'
import {BloodPressure, Medication, BloodSugar} from '../models'

export interface PatientResponseData {
  patient_id: string
  full_name?: string
  password_digest?: string
  blood_pressures: BloodPressure[]
  medications: Medication[]
  blood_sugars: BloodSugar[]
}

export const getPatient = async () => {
  try {
    const response = await axios.get(`${MOCK_API_ENDPOINT}/patient`)
    const patientResponseData: PatientResponseData = response.data?.patient
    if (
      !patientResponseData.patient_id ||
      !patientResponseData.blood_pressures
    ) {
      throw new Error('Invalid patient data')
    }
    return patientResponseData
  } catch (err) {
    throw err
  }
}
