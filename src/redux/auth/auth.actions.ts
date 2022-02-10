import axios, {AxiosResponse} from 'axios'
import {
  API_INDIA_ENDPOINT,
  API_BANGLADESH_ENDPOINT,
  API_ETHIOPIA_ENDPOINT,
} from '../../constants/api'
import {AuthActionTypes} from './auth.types'
import {AppThunk} from '../store'
import {LoginState, AuthParams, PassportLinkedState} from './auth.models'
import {getPatient} from '../patient/patient.actions'
import analytics from '@react-native-firebase/analytics'

export const setApiEndpoint = (apiEndpoint: string | undefined) => ({
  type: AuthActionTypes.SET_API_ENDPOINT,
  payload: apiEndpoint,
})

export const setAuthParams = (authParams: AuthParams | undefined) => ({
  type: AuthActionTypes.SET_AUTH_PARAMS,
  payload: authParams,
})

export const logout = () => ({
  type: AuthActionTypes.LOG_OUT,
})

export const setLoginState = (loginState: LoginState) => ({
  type: AuthActionTypes.SET_LOGIN_STATE,
  payload: loginState,
})

export const setPassportLinkedState = (
  passportLinkedState: PassportLinkedState,
) => ({
  type: AuthActionTypes.SET_PASSPORT_LINKED_STATE,
  payload: passportLinkedState,
})

export const activate = (
  passportId: string,
): AppThunk<Promise<boolean>> => async dispatch => {
  try {
    let apiEndPoint: string | undefined
    const possibles = [
      API_INDIA_ENDPOINT,
      API_BANGLADESH_ENDPOINT,
      API_ETHIOPIA_ENDPOINT,
    ]

    for (const api of possibles) {
      try {
        await axios.post(`${api}/patient/activate`, {
          passport_id: passportId,
        })
        apiEndPoint = api
        break
      } catch (err) {}
    }

    if (apiEndPoint) {
      dispatch(setApiEndpoint(apiEndPoint))
      return true
    } else {
      throw new Error('No api match for passport')
    }
  } catch (err) {
    const response: AxiosResponse | undefined = err.response
    if (response && response.status) {
      if (response.status === 404) {
        throw new Error("Can't verify account")
      }
    }
    throw err
  }
}

export const login = (passportId: string, otp: string): AppThunk => async (
  dispatch,
  getState,
) => {
  try {
    const apiEndPoint = getState().auth.apiEndPoint ?? API_INDIA_ENDPOINT

    console.log('login...', apiEndPoint)

    const response = await axios.post(`${apiEndPoint}/patient/login`, {
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
    dispatch(setLoginState(LoginState.LoggedIn))
    dispatch(setPassportLinkedState(PassportLinkedState.Linking))
    dispatch(getPatient())

    analytics()
      .setUserProperty('has_passport', 'true')
      .then(() => {
        console.log('User has_passport set')
      })
      .catch(err => {
        console.log('Analytics >> has_passport failed', err)
      })

    analytics()
      .logEvent('linked_passport', {
        passportId,
      })
      .then(() => {
        console.log('Analytics >> link passport worked')
      })
      .catch(err => {
        console.log('Analytics >> link passport failed', err)
      })

    return true
  } catch (err) {
    console.log('response...', JSON.stringify(err))
    throw err
  }
}

export const loginNoApi = () => ({
  type: AuthActionTypes.SET_LOGIN_STATE,
  payload: LoginState.LoggedIn,
})
