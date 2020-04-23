import axios from 'axios'
import {API_ENDPOINT} from '../../constants/api'
import {AuthActionTypes} from './auth.types'
import {AppThunk} from '../store'

export interface AuthParams {
  access_token: string
  id: string /* patient id */
  passport: {id: string /* passport id */; shortcode: string}
}

export const setAuthParams = (authParams: AuthParams) => ({
  type: AuthActionTypes.SET_AUTH_PARAMS,
  payload: authParams,
})

export const activate = (passportId: string): AppThunk => async (dispatch) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/patient/activate`, {
      passport_id: passportId,
    })
    return true
  } catch (err) {
    console.log('yo??')
    throw err
  }
}

export const login = (passportId: string, otp: string): AppThunk => async (
  dispatch,
) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/patient/login`, {
      passport_id: passportId,
      otp,
    })
    const authParams: AuthParams = response.data?.patient
    if (
      !authParams.id ||
      !authParams.access_token ||
      !authParams.passport ||
      !authParams.passport.id ||
      !authParams.passport.shortcode
    ) {
      throw new Error('Invalid auth data')
    }

    dispatch(setAuthParams(authParams))

    return true
  } catch (err) {
    throw err
  }
}
