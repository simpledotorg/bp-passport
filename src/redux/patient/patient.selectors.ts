import {useSelector} from 'react-redux'
import {RootState} from '../store'
import {BloodSugarCode} from '../../utils/blood-sugars'

export const patientSelector = () => {
  return useSelector((state: RootState) => state.patient.patient)
}

export const localeSelector = () => {
  return useSelector((state: RootState) => state.patient.locale)
}

export const hasReviewedSelector = () => {
  return useSelector((state: RootState) => state.patient.hasReviewed)
}

export const normalBpBsCountSelector = () => {
  return useSelector((state: RootState) => state.patient.normalBpBsCount)
}

export const bloodSugarUnitSelector = () => {
  return useSelector(
    (state: RootState) => state.patient.bloodSugarUnit ?? BloodSugarCode.MG_DL,
  )
}
