import {useSelector} from 'react-redux'
import {RootState} from '../store'

export const bloodPressuresSelector = () => {
  return useSelector((state: RootState) => state.bloodPressure.bloodPressures)
}
