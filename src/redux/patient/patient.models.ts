import {BloodPressure, Medication} from '../../models'

export interface PatientResponseData {
  patient_id: string
  full_name?: string
  password_digest?: string
  blood_pressures: BloodPressure[]
  medications: Medication[]
}

export interface Patient {
  patient_id: string
  full_name?: string
  password_digest?: string
}
