import axios, {AxiosRequestConfig, AxiosResponse} from 'axios'
import {PatientActionTypes} from './patient.types'
import {PatientResponseData, Patient} from './patient.models'
import {AppThunk} from '../store'
import {API_ENDPOINT} from '../../constants/api'
import {mergeBloodPressures} from '../blood-pressure/blood-pressure.actions'
import {mergeBloodSugars} from '../blood-sugar/blood-sugar.actions'
import {mergeMedications} from '../medication/medication.actions'
import {LoginState} from '../auth/auth.models'
import {setLoginState, logout, setAuthParams} from '../auth/auth.actions'

export const setPatient = (patient: Patient) => ({
  type: PatientActionTypes.SET_PATIENT,
  payload: patient,
})

export const getPatient = (): AppThunk => async (dispatch, getState) => {
  try {
    const authParams = getState().auth.authParams
    if (!authParams) {
      throw new Error('Cannot get patient without auth params')
    }
    const config: AxiosRequestConfig = {
      headers: {},
    }
    config.headers.Authorization = `Bearer ${authParams.access_token}`
    config.headers['X-Patient-ID'] = authParams.id
    config.headers['Content-Type'] = 'application/json'
    config.headers['Cache-Control'] = 'no-cache'

    const response = await axios.get(`${API_ENDPOINT}/patient`, config)
    const patientResponseData: PatientResponseData = response.data?.patient
    if (!patientResponseData.id) {
      throw new Error('Invalid patient data')
    }

    const {id, full_name, address} = patientResponseData

    dispatch(
      setPatient({
        id,
        full_name,
        address,
      }),
    )

    if (patientResponseData.blood_pressures) {
      dispatch(mergeBloodPressures([...patientResponseData.blood_pressures]))
    }

    if (patientResponseData.medications) {
      dispatch(mergeMedications([...patientResponseData.medications]))
    }

    if (patientResponseData.blood_sugars) {
      dispatch(mergeBloodSugars([...patientResponseData.blood_sugars]))
    }

    dispatch(setLoginState(LoginState.LoggedIn))

    return true
  } catch (err) {
    const response: AxiosResponse | undefined = err.response
    if (response && response.status) {
      if (response.status === 401) {
        // auth params seem to now be invalid
        console.log('REMOVE AUTH PARAMS!')
        dispatch(setAuthParams(undefined))
        // dispatch(logout())
      }
    }

    throw err
  }
}
