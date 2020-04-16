import axios from 'axios'

import {MOCK_API_ENDPOINT} from './constants'

export const getPatient = async () => {
  try {
    const response = await axios.get(`${MOCK_API_ENDPOINT}/patient`)
    const data = response.data
    console.log('Get Patient complete')
    console.log('data: ', data)
    return true
  } catch (err) {
    throw err
  }
}
