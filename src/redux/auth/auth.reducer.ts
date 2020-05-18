import React from 'react'
import {AuthActionTypes} from './auth.types'
import {
  AuthParams,
  LoginState,
  PassportLinkedState,
  Passport,
} from './auth.models'

const INITIAL_STATE: {
  loginState: LoginState
  passportLinkedState: PassportLinkedState
  authParams?: AuthParams
  passport?: Passport
} = {
  loginState: LoginState.LoggedOut,
  passportLinkedState: PassportLinkedState.NotLinked,
  authParams: undefined,
  passport: undefined,
}

const authReducer = (state = INITIAL_STATE, action) => {
  console.log('authReducer update', state, action)
  switch (action.type) {
    case AuthActionTypes.SET_AUTH_PARAMS:
      return {
        ...state,
        authParams: action.payload,
        passport: action.payload.passport,
      }
    case AuthActionTypes.SET_LOGIN_STATE:
      const loginState: LoginState = action.payload
      return {
        ...state,
        loginState,
      }
    case AuthActionTypes.SET_PASSPORT_LINKED_STATE:
      const passportLinkedState: PassportLinkedState = action.payload
      return {
        ...state,
        passportLinkedState,
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
