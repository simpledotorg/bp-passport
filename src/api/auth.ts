import axios from 'axios'

import {API_ENDPOINT} from './constants'

interface LoginBody {
  phone_number: string
  password: string
  otp: string
}

export const login = (body: LoginBody) => {
  return axios.post(`${API_ENDPOINT}/login`, body)
}
