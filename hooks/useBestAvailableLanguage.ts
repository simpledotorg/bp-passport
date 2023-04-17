import { getLocales } from 'expo-localization'
import {
  AVAILABLE_TRANSLATIONS,
  DEFAULT_LANGUAGE_CODE,
} from '../constants/languages'

export default function useBestAvailableLanguage() {
  const userLocales = []
  const getUserLocales = getLocales()
  getUserLocales.forEach((language) => {
    userLocales.push(language.languageCode)
  })

  const matchingLocales = userLocales.filter((local) => {
    return AVAILABLE_TRANSLATIONS.includes(local)
  })

  if (matchingLocales[0]) {
    return matchingLocales[0]
  } else {
    return DEFAULT_LANGUAGE_CODE
  }
}
