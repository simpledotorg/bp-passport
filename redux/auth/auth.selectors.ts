import { useSelector } from 'react-redux'
import { RootState } from '../store'

export const LoginStateSelector = () => {
  return useSelector((state: RootState) => state.auth.loginState)
}

export const PassportLinkedStateSelector = () => {
  return useSelector((state: RootState) => state.auth.passportLinkedState)
}

export const AuthParamsSelector = () => {
  return useSelector((state: RootState) => state.auth.authParams)
}

export const PassportSelector = () => {
  return useSelector((state: RootState) => state.auth.passport)
}
