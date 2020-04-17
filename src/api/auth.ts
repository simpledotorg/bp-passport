import axios from 'axios'
import {API_ENDPOINT} from './constants'

export const authRequestOtp = (body: {passport_id: string}) => {
  return axios.post(`${API_ENDPOINT}/patient/activate`, body)
}

export interface AuthParams {
  access_token: string
  patient_id: string
}

export const authActivate = async (body: {
  passport_id: string
  otp: string
}) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/patient/login`, body)
    const authParams: AuthParams = response.data?.patient
    if (!authParams.access_token || !authParams.patient_id) {
      throw new Error('Invalid authentication data')
    }
    console.log('Authentication complete', authParams)
    return authParams
  } catch (err) {
    throw err
  }
}
