import React, {useEffect} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {IntlProvider} from 'react-intl'
import useLocaleMessages from './effects/use-locale-messages.effect'

import Navigation from './Navigation'

import UserProvider from './providers/user.provider'

export default function App() {
  const localeMessages = useLocaleMessages()

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
