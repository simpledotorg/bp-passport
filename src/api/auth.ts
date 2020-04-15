import axios from 'axios'
import {API_ENDPOINT} from './constants'

export const authRequestOtp = (body: {passport_id: string}) => {
  return axios.post(`${API_ENDPOINT}/patient/request_otp`, body)
}

export const authActivate = (body: {passport_id: string; otp: string}) => {
  return axios.post(`${API_ENDPOINT}/patient/activate`, body)
}
