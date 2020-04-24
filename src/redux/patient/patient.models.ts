import {BloodPressure} from '../blood-pressure/blood-pressure.models'
import {BloodSugar} from '../blood-sugar/blood-sugar.models'
import {Medication} from '../medication/medication.models'

interface Address {
  id: string
  street_address?: string
  village_or_colony?: string
  district?: string
  zone?: string
  state?: string
  country?: string
  pin?: string
}

export interface PatientResponseData {
  id: string
  full_name?: string
  blood_pressures: BloodPressure[]
  medications: Medication[]
  address?: Address
  blood_sugars: BloodSugar[]
}

export interface Patient {
  id: string
  full_name?: string
  address?: Address
}
