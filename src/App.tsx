import React, {useEffect} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {IntlProvider} from 'react-intl'
import useLocaleMessages from './effects/use-locale-messages.effect'

import Navigation from './Navigation'

import UserProvider from './providers/user.provider'

const App = () => {
  const locale = useLocaleMessages()

  useEffect(() => {
    console.log('change')
  }, [locale.locale])

  console.log(locale.messages)

  return (
    <IntlProvider locale={locale.locale} messages={locale.messages}>
      <UserProvider>
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </UserProvider>
    </IntlProvider>
  )
}

export default App
