import React, {createContext, useContext, useState, ReactNode} from 'react'
import * as RNLocalize from 'react-native-localize'

import {AVAILABLE_TRANSLATIONS, ENGLISH} from '../constants/languages'

export const LocaleContext = createContext({
  locale: ENGLISH,
  setLocale: () => {},
} as any)

export const useLocale = () => {
  const context = useContext(LocaleContext)
  if (!context)
    throw new Error('Cannot use `useLocale` outside of LocaleProvider')

  return context
}

export const LocaleProvider = ({children}: any) => {
  const [locale, setLocale] = useState(
    RNLocalize.findBestAvailableLanguage(AVAILABLE_TRANSLATIONS)?.languageTag ||
      ENGLISH,
  )

  return (
    <LocaleContext.Provider value={{locale, setLocale}}>
      {children}
    </LocaleContext.Provider>
  )
}
