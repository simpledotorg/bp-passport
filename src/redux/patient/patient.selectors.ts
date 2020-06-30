import {useSelector} from 'react-redux'
import {RootState} from '../store'

export const patientSelector = () => {
  return useSelector((state: RootState) => state.patient.patient)
}

export const localeSelector = () => {
  return useSelector((state: RootState) => state.patient.locale)
}

export const hasReviewedSelector = () => {
  return useSelector((state: RootState) => state.patient.hasReviewed)
}

export const normalBpCountSelector = () => {
  return useSelector((state: RootState) => state.patient.normalBpCount)
}

export const normalBsCountSelector = () => {
  return useSelector((state: RootState) => state.patient.normalBsCount)
}
