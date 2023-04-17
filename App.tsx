import React from 'react'
import { LogBox } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { IntlProvider } from 'react-intl'
import { PersistGate } from 'redux-persist/es/integration/react'
import { Provider } from 'react-redux'
import { store, persistor } from './redux/store'
import useCachedResources from './hooks/useCachedResources'

import Navigation from './navigation/Navigation'

import { LocaleSelector } from './redux/patient/patient.selectors'
import {
  DEFAULT_LANGUAGE_CODE,
  translationsForCode,
} from './constants/languages'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import useBestAvailableLanguage from './hooks/useBestAvailableLanguage'
import * as Notifications from 'expo-notifications'

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
])

const App = () => {
  const isLoadingComplete = useCachedResources()

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  })

  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <PersistGateConsumer />
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    )
  }
}

const PersistGateConsumer = () => {
  const localeStored = LocaleSelector()

  const bestAvailableLanguage = useBestAvailableLanguage()

  const locale = localeStored ? localeStored : bestAvailableLanguage

  return (
    <IntlProvider
      locale={locale}
      messages={translationsForCode(locale)}
      defaultLocale={DEFAULT_LANGUAGE_CODE}
      onError={(err) => {
        if (err.code === 'MISSING_TRANSLATION') {
          throw err
        }
        console.log('IntlProvider Err', err)
      }}
    >
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </IntlProvider>
  )
}

export default App
