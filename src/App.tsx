import React, {useContext} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {IntlProvider} from 'react-intl'
import {PersistGate} from 'redux-persist/es/integration/react'
import {Provider} from 'react-redux'
import {store, persistor} from './redux/store'

import {
  LocaleProvider,
  LocaleContext,
} from './effects/use-locale-messages.effect'
import Navigation from './Navigation'
import en from '../translations/master.json'
import hi from './translations/strings_hi_IN.json'
import mr from './translations/strings_mr_IN.json'
import pa from './translations/strings_pa_IN.json'
import fr from './translations/strings_fr.json'
import es from './translations/strings_es.json'

const App = () => {
  const languages: {
    [key: string]: {}
  } = {en, hi, mr, pa, fr, es}

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LocaleProvider>
          <LocaleContext.Consumer>
            {({locale}) => {
              return (
                <IntlProvider locale={locale} messages={languages[locale]}>
                  <NavigationContainer>
                    <Navigation />
                  </NavigationContainer>
                </IntlProvider>
              )
            }}
          </LocaleContext.Consumer>
        </LocaleProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
