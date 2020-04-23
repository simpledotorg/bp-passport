import axios, {AxiosRequestConfig} from 'axios'
import {PatientActionTypes} from './patient.types'
import {AppThunk} from '../store'
import {BloodPressure, Medication, Patient} from '../../models'
import {API_ENDPOINT} from '../../constants/api'

export interface PatientResponseData {
  patient_id: string
  full_name?: string
  password_digest?: string
  blood_pressures: BloodPressure[]
  medications: Medication[]
}

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
    config.headers['X-Patient-ID'] = authParams.passport_id
    config.headers['Content-Type'] = 'application/json'
    config.headers['Cache-Control'] = 'no-cache'

    const response = await axios.get(`${API_ENDPOINT}/patient`, config)
    const patientResponseData: PatientResponseData = response.data?.patient
    if (!patientResponseData.patient_id) {
      throw new Error('Invalid patient data')
    }

    const {patient_id, full_name, password_digest} = patientResponseData

    dispatch(
      setPatient({
        patient_id,
        full_name,
        password_digest,
      }),
    )

    return true
  } catch (err) {
    throw err
  }
}
