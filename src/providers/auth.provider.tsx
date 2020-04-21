import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from 'react'
import {AuthParams} from '../api'
import {getPatient} from '../api/patient'
import AsyncStorage from '@react-native-community/async-storage'
import {UserContext} from '../providers/user.provider'
import axios from 'axios'

export enum LoginState {
  LoggedOut,
  LoggingIn,
  LoggedIn,
}

export const AuthContext = createContext({
  loginState: LoginState.LoggedOut,
  setAuthParams: (params: AuthParams | undefined) => {},
  setLoginState: (state: LoginState) => {},
  signOut: async () => {},
})

const KEYS = {
  ACCESS_TOKEN: 'accessToken',
  PATIENT_ID: 'patientId',
}

const AuthProvider = ({children}) => {
  const [authParams, setAuthParams] = useState<AuthParams | undefined>(
    undefined,
  )
  const [loginState, setLoginState] = useState(LoginState.LoggedOut)
  const {setPatientData} = useContext(UserContext)

  const axiosInterceptor: any = useRef(null)

  useEffect(() => {
    if (axiosInterceptor.current !== null) {
      axios.interceptors.request.eject(axiosInterceptor.current)
    }

    axiosInterceptor.current = axios.interceptors.request.use(
      (config) => {
        if (authParams) {
          config.headers = {
            Authorization: `Bearer ${authParams.access_token}`,
          }
          config.headers['X-Patient-ID'] = authParams.patient_id
        }

        config.headers['Content-Type'] = 'application/json'
        config.headers['Cache-Control'] = 'no-cache'
        return config
      },
      (error) => {
        // Do something with request error
        console.log('error with axois interceptor', error)
        return Promise.reject(error)
      },
    )
  }, [authParams])

  const signOut = async () => {
    setAuthParams(undefined)
    setLoginState(LoginState.LoggedOut)
    try {
      await AsyncStorage.multiRemove([KEYS.ACCESS_TOKEN, KEYS.PATIENT_ID])
    } catch (err) {
      console.log('signOut error >> ', err)
    }
  }

  useEffect(() => {
    if (authParams && loginState === LoginState.LoggedOut) {
      setLoginState(LoginState.LoggingIn)
      getPatient()
        .then((patientResponseData) => {
          // worked out! token and patient are valid
          setLoginState(LoginState.LoggedIn)
          if (patientResponseData) {
            setPatientData(patientResponseData)
          }

          AsyncStorage.multiSet([
            [KEYS.ACCESS_TOKEN, authParams.access_token],
            [KEYS.PATIENT_ID, authParams.patient_id],
          ])
        })
        .catch((err) => {
          console.log('error getting patient... signing out.', err)
          signOut()
        })
    }
  }, [authParams])

  useEffect(() => {
    const checkCachedTokens = async () => {
      try {
        const values = await AsyncStorage.multiGet([
          KEYS.ACCESS_TOKEN,
          KEYS.PATIENT_ID,
        ])
        const accessToken = values[0][1]
        const patientId = values[1][1]

        if (accessToken && patientId) {
          console.log('setAuthParams: ', accessToken, patientId)
          setAuthParams({
            access_token: accessToken,
            patient_id: patientId,
          })
        }
      } catch (err) {}
    }

    checkCachedTokens()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        setLoginState,
        loginState,
        setAuthParams,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
