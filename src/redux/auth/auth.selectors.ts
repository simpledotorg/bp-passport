import {useSelector} from 'react-redux'
import {RootState} from '../store'

export const loginStateSelector = () => {
  return useSelector((state: RootState) => state.auth.loginState)
}

export const passportLinkedStateSelector = () => {
  return useSelector((state: RootState) => state.auth.passportLinkedState)
}

export const authParamsSelector = () => {
  return useSelector((state: RootState) => state.auth.authParams)
}
