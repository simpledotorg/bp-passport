import {useSelector} from 'react-redux'
import {RootState} from '../store'

export const bloodSugarsSelector = () => {
  return useSelector((state: RootState) => state.bloodSugar.bloodSugars)
}
