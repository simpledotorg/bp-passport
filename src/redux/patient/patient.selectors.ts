import {useSelector} from 'react-redux'
import {RootState} from '../store'

export const patientSelector = () => {
  return useSelector((state: RootState) => state.patient.patient)
}

export const localeSelector = () => {
  return useSelector((state: RootState) => state.patient.locale)
}
