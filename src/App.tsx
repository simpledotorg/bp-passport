import React, {useRef, useEffect} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {IntlProvider} from 'react-intl'
import useLocaleMessages from './effects/use-locale-messages.effect'
import axios from 'axios'

import Navigation from './Navigation'
import UserProvider from './providers/user.provider'

export default function App() {
  const localeMessages = useLocaleMessages()
  const axiosInterceptor: any = useRef(null)

  useEffect(() => {
    if (axiosInterceptor.current !== null) {
      axios.interceptors.request.eject(axiosInterceptor.current)
    }
    // Add a request interceptor
    axiosInterceptor.current = axios.interceptors.request.use(
      (config) => {
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
    <IntlProvider
      locale={localeMessages.locale}
      messages={localeMessages.messages}>
      <UserProvider>
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </UserProvider>
    </IntlProvider>
  )
}
