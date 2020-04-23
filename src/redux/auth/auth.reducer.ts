import React from 'react'
import {AuthParams} from '../../api'
import {AuthActionTypes} from './auth.types'

export enum LoginState {
  LoggedOut,
  LoggingIn,
  LoggedIn,
}

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
      }
    default:
      return state
  }
}

export default authReducer
