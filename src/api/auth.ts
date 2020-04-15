import axios from 'axios'
import {API_ENDPOINT} from './constants'

export const authRequestOtp = (body: {passport_id: string}) => {
  return axios.post(`${API_ENDPOINT}/patient/request_otp`, body)
}

interface AuthResponseData {
  access_token: string
}

export const authActivate = async (body: {
  passport_id: string
  otp: string
}) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/patient/activate`, body)
    const data: AuthResponseData = response.data
    if (!data.access_token) {
      throw new Error('Invalid authentication data')
    }
    console.log('Authentication complete')
    console.log('access_token: ', data.access_token)
    return true
  } catch (err) {
    throw err
  }
}
