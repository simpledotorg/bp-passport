import {BloodPressure} from '../blood-pressure/blood-pressure.models'
import {Medication} from '../../models'

export interface PatientResponseData {
  id: string
  full_name?: string
  password_digest?: string
  blood_pressures: BloodPressure[]
  medications: Medication[]
}

export interface Patient {
  id: string
  full_name?: string
  password_digest?: string
}
