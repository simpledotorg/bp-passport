import axios from 'axios'

import {MOCK_API_ENDPOINT} from './constants'
import {Patient} from '../models'

export const getPatient = async () => {
  try {
    const response = await axios.get(`${MOCK_API_ENDPOINT}/patient`)
    const data = response.data
    const patientData: Patient = data.patient
    if (!patientData.patient_id) {
      throw new Error('Invalid patient data')
    }
    return patientData
  } catch (err) {
    throw err
  }
}
