import axios from 'axios'

import {API_ENDPOINT} from './constants'

export const getBloodPressures = () => {
  return axios.get(`${API_ENDPOINT}/blood_pressures/sync`)
}
