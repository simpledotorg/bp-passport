import axios from 'axios'
import {API_ENDPOINT} from './constants'

export const authRequestOtp = (body: {passport_id: string}) => {
  return axios.post(`${API_ENDPOINT}/patient/request_otp`, body)
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
    const response = await axios.post(`${API_ENDPOINT}/patient/activate`, body)
    const data: AuthParams = response.data
    if (!data.access_token || !data.patient_id) {
      throw new Error('Invalid authentication data')
    }
    console.log('Authentication complete')
    console.log('access_token: ', data)
    return data
  } catch (err) {
    throw err
  }
}
