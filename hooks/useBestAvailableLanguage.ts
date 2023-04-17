import { getLocales } from 'expo-localization'
import {
  AVAILABLE_TRANSLATIONS,
  DEFAULT_LANGUAGE_CODE,
} from '../constants/languages'

export default function useBestAvailableLanguage() {
  const userLocals: string[] = []
  const getUserLocals = getLocales()
  getUserLocals.forEach((language) => {
    userLocals.push(language.languageCode)
  })

  const matchingLocals = AVAILABLE_TRANSLATIONS.filter((local) => {
    return userLocals.includes(local)
  })

  if (matchingLocals[0]) {
    return matchingLocals[0]
  } else {
    return DEFAULT_LANGUAGE_CODE
  }
}
