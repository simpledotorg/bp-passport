import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { PatientActionTypes } from './patient.types'
import { PatientResponseData, Patient } from './patient.models'
import { AppThunk } from '../store'
import { mergeBloodPressures } from '../blood-pressure/blood-pressure.actions'
import { mergeBloodSugars } from '../blood-sugar/blood-sugar.actions'
import { mergeMedications } from '../medication/medication.actions'
import { PassportLinkedState } from '../auth/auth.models'
import { setAuthParams, setPassportLinkedState } from '../auth/auth.actions'
import useApi from '../../hooks/useApi'

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
      headers: {
        Authorization: `Bearer ${authParams.access_token}`,
        ['X-Patient-ID']: authParams.id,
        ['Content-Type']: 'application/json',
        ['Cache-Control']: 'no-cache',
      },
    }

    const { API_INDIA_ENDPOINT } = useApi()

    const apiEndPoint = getState().auth.apiEndPoint ?? API_INDIA_ENDPOINT

    const response = await axios.get(`${apiEndPoint}/patient`, config)
    const patientResponseData: PatientResponseData = response.data?.patient
    if (!patientResponseData.id) {
      throw new Error('Invalid patient data')
    }

    const { id, full_name, address } = patientResponseData

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

    dispatch(setPassportLinkedState(PassportLinkedState.Linked))

    return true
  } catch (err) {
    const response: AxiosResponse | undefined = err.response
    if (response && response.status) {
      if (response.status === 401) {
        // auth params seem to now be invalid
        dispatch(setAuthParams(undefined))
        dispatch(setPassportLinkedState(PassportLinkedState.NotLinked))
      }
      console.log('error loading api patient: ', err)
    }
    throw err
  }
}

export const setLanguage = (locale: string) => ({
  type: PatientActionTypes.SET_LANGUAGE,
  payload: locale,
})

export const setHasReviewed = (hasReviewed: boolean) => ({
  type: PatientActionTypes.SET_HAS_REVIEWED,
  payload: hasReviewed,
})

export const setNormalBpBsCount = (count: number) => ({
  type: PatientActionTypes.SET_NORMAL_BP_BS_COUNT,
  payload: count,
})

export const setBloodSugarUnit = (locale: string) => ({
  type: PatientActionTypes.SET_BLOOD_SUGAR_UNIT,
  payload: locale,
})
