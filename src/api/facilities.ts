import axios from 'axios'

import {API_ENDPOINT} from './constants'

export const getFacilities = () => {
  return axios.get(`${API_ENDPOINT}/facilities/sync`)
}
