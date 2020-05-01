import {useSelector} from 'react-redux'
import {RootState} from '../store'

export const medicationsSelector = () => {
  return useSelector((state: RootState) => state.medication.medications)
}

export const medicationsLibrarySelector = () => {
  return useSelector((state: RootState) => state.medication.medicationsLibrary)
}
