import {useSelector} from 'react-redux'
import {RootState} from '../store'

export const loginStateSelector = () => {
  return useSelector((state: RootState) => state.auth.loginState)
}
