import React from 'react'
import {AuthActionTypes} from './auth.types'
import {AuthParams, LoginState, PassportLinkedState} from './auth.models'

const INITIAL_STATE: {
  loginState: LoginState
  passportLinkedState: PassportLinkedState
  authParams?: AuthParams
} = {
  loginState: LoginState.LoggedOut,
  passportLinkedState: PassportLinkedState.NotLinked,
  authParams: undefined,
}

const authReducer = (state = INITIAL_STATE, action) => {
  console.log('authReducer update', state, action)
  switch (action.type) {
    case AuthActionTypes.SET_AUTH_PARAMS:
      return {
        ...state,
        authParams: action.payload,
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
      console.log('before: ', state.loginState)
      console.log('after: ', Math.min(state.loginState, LoginState.LoggedIn))
      return {
        ...state,
      }
  }
}

export default authReducer
