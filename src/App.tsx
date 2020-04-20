import React, {useContext} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {IntlProvider} from 'react-intl'

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

const App = () => {
  const languages: {
    [key: string]: {}
  } = {en, hi, mr, pa}

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
