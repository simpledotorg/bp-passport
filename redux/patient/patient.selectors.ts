import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { BloodSugarCode } from '../../utils/blood-sugars'

export const PatientSelector = () => {
  return useSelector((state: RootState) => state.patient.patient)
}

export const LocaleSelector = () => {
  return useSelector((state: RootState) => state.patient.locale)
}

export const HasReviewedSelector = () => {
  return useSelector((state: RootState) => state.patient.hasReviewed)
}

export const NormalBpBsCountSelector = () => {
  return useSelector((state: RootState) => state.patient.normalBpBsCount)
}

export const BloodSugarUnitSelector = () => {
  return useSelector(
    (state: RootState) => state.patient.bloodSugarUnit ?? BloodSugarCode.MG_DL,
  )
}
