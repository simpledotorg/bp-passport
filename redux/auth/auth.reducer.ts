import { AuthActionTypes } from './auth.types'
import {
  AuthParams,
  LoginState,
  PassportLinkedState,
  Passport,
} from './auth.models'
import { AnyAction } from 'redux'

const INITIAL_STATE: {
  loginState: LoginState
  passportLinkedState: PassportLinkedState
  authParams?: AuthParams
  passport?: Passport
  apiEndPoint?: string
} = {
  loginState: LoginState.LoggedOut,
  passportLinkedState: PassportLinkedState.NotLinked,
  authParams: undefined,
  passport: undefined,
  apiEndPoint: undefined,
}

const authReducer = (state = INITIAL_STATE, action: AnyAction) => {
  // console.log('authReducer update', state, action)
  switch (action.type) {
    case AuthActionTypes.SET_API_ENDPOINT:
      console.log('SETTING API ENDPOINT: ', action.payload)
      return {
        ...state,
        apiEndPoint: action.payload,
      }
    case AuthActionTypes.SET_AUTH_PARAMS:
      return {
        ...state,
        authParams: action.payload,
        passport: action.payload.passport,
      }
    case AuthActionTypes.SET_LOGIN_STATE: {
      const loginState: LoginState = action.payload
      return {
        ...state,
        loginState,
      }
    }
    case AuthActionTypes.SET_PASSPORT_LINKED_STATE: {
      const passportLinkedState: PassportLinkedState = action.payload
      return {
        ...state,
        passportLinkedState,
      }
    }
    case AuthActionTypes.LOG_OUT:
      return {
        ...INITIAL_STATE,
      }
    default:
      return state
  }
}

export default authReducer
