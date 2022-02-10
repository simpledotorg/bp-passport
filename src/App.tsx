import React from 'react'
import {LogBox} from 'react-native'
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

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
])

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

  // addLocaleData({ locale: languageCode, pluralRuleFunction: () => {}, });

  return (
    <IntlProvider
      locale={locale}
      messages={translationsForCode(locale)}
      defaultLocale={DEFAULT_LANGUAGE_CODE}
      onError={err => {
        if (err.code === 'MISSING_TRANSLATION') {
          throw err
        }
        console.log('IntlProvider Err', err)
      }}>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </IntlProvider>
  )
}

export default App
