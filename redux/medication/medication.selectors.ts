import { useSelector } from 'react-redux'
import { RootState } from '../store'

export const MedicationsSelector = () => {
  return useSelector((state: RootState) => state.medication.medications)
}

export const MedicationsLibrarySelector = () => {
  return useSelector((state: RootState) => state.medication.medicationsLibrary)
}
