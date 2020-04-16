import React, {useRef, useEffect, useContext} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {IntlProvider} from 'react-intl'
import axios from 'axios'

import {
  LocaleProvider,
  LocaleContext,
} from './effects/use-locale-messages.effect'
import Navigation from './Navigation'
import UserProvider from './providers/user.provider'
import AuthProvider from './providers/auth.provider'
import en from './translations/strings_en.json'
import hi from './translations/strings_hi_IN.json'
import mr from './translations/strings_mr_IN.json'
import pa from './translations/strings_pa_IN.json'
import SCREENS from './constants/screens'

const App = () => {
  const languages: {
    [key: string]: {}
  } = {en, hi, mr, pa}

  const axiosInterceptor: any = useRef(null)

  const navigationRef = React.useRef()

  useEffect(() => {
    if (axiosInterceptor.current !== null) {
      axios.interceptors.request.eject(axiosInterceptor.current)
    }
    // Add a request interceptor
    axiosInterceptor.current = axios.interceptors.request.use(
      (config) => {
        // TODO: Replace when ready
        // config.headers = {
        //   Authorization:
        //     'Bearer b23d213d435d3923ed00b82d10dfd0fd9aa21e2a46a0faa36e648875b07b87a7',
        //   'X-User-Id': '87e8853d-5c1a-43e7-b273-d6d72e749b18',
        //   'X-Facility-Id': '2aca23c6-fae2-484f-bc0d-97ee4117ac53',
        // }
        return config
      },
      (error) => {
        // Do something with request error
        return Promise.reject(error)
      },
    )
  }, [])

  return (
    <LocaleProvider>
      <LocaleContext.Consumer>
        {({locale}) => {
          return (
            <IntlProvider locale={locale} messages={languages[locale]}>
              <UserProvider>
                <AuthProvider>
                  <NavigationContainer>
                    <Navigation />
                  </NavigationContainer>
                </AuthProvider>
              </UserProvider>
            </IntlProvider>
          )
        }}
      </LocaleContext.Consumer>
    </LocaleProvider>
  )
}

export default App
