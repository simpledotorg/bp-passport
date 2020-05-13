import {useSelector} from 'react-redux'
import {RootState} from '../store'

export const loginStateSelector = () => {
  return useSelector((state: RootState) => state.auth.loginState)
}

export const authParamsSelector = () => {
  return useSelector((state: RootState) => state.auth.authParams)
}

export const dataIsLinkedWithApiSelector = () => {
  return useSelector((state: RootState) =>
    state.auth.authParams ? true : false,
  )
}
