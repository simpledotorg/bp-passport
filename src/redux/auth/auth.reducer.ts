import React from 'react'
import {AuthActionTypes} from './auth.types'
import {AuthParams, LoginState} from './auth.models'

const INITIAL_STATE: {loginState: LoginState; authParams?: AuthParams} = {
  loginState: LoginState.LoggedOut,
  authParams: undefined,
}

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AuthActionTypes.SET_AUTH_PARAMS:
      return {
        ...state,
        authParams: action.payload,
        loginState: LoginState.LoggingIn,
      }
    default:
      return state
  }
}

export default authReducer
