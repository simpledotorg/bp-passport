import {useSelector} from 'react-redux'
import {RootState} from '../store'
import {BloodSugar} from './blood-sugar.models'

export const bloodSugarsSelector = (): BloodSugar[] | undefined => {
  return useSelector((state: RootState) => state.bloodSugar.bloodSugars)
}
