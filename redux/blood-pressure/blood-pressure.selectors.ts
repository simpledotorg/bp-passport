import { useSelector } from 'react-redux'
import { RootState } from '../store'

export const BloodPressuresSelector = () => {
  return useSelector((state: RootState) => state.bloodPressure.bloodPressures)
}
