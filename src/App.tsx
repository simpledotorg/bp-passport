import React, {useContext} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {IntlProvider} from 'react-intl'
import {PersistGate} from 'redux-persist/es/integration/react'
import {Provider} from 'react-redux'
import {store, persistor} from './redux/store'
import * as RNLocalize from 'react-native-localize'

import Navigation from './Navigation'

import {localeSelector} from './redux/patient/patient.selectors'
import {
  DEFAULT_LANGUAGE_CODE,
  AVAILABLE_TRANSLATIONS,
  translationsForCode,
} from './constants/languages'

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PersistGateConsumer />
      </PersistGate>
    </Provider>
  )
}

const PersistGateConsumer = () => {
  const localeStored = localeSelector()
  const locale =
    localeStored ??
    (RNLocalize.findBestAvailableLanguage(AVAILABLE_TRANSLATIONS)
      ?.languageTag ||
      DEFAULT_LANGUAGE_CODE)

  return (
    <IntlProvider locale={locale} messages={translationsForCode(locale)}>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </IntlProvider>
  )
}

export default App
