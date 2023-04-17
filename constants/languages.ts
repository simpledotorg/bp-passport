import enTranslations from '../translationsMaster/master.json'
import hiTranslations from '../translations/strings_hi_IN.json'
import mrTranslations from '../translations/strings_mr.json'
import paTranslations from '../translations/strings_pa_IN.json'
import frTranslations from '../translations/strings_fr.json'
import esTranslations from '../translations/strings_es.json'
import bnTranslations from '../translations/strings_bn.json'
import bnInTranslations from '../translations/strings_bn_IN.json'
import amTranslations from '../translations/strings_am_ET.json'
import frCATranslations from '../translations/strings_fr_CA.json'
import knTranslations from '../translations/strings_kn.json'
import omTranslations from '../translations/strings_om.json'
import taTranslations from '../translations/strings_ta.json'
import teTranslations from '../translations/strings_te.json'
import tiTranslations from '../translations/strings_ti.json'

export enum LanguageCode {
  ENGLISH = 'en',
  HINDI = 'hi',
  MARATHI = 'mr',
  PUNJABI = 'pa',
  BENGALI = 'bn',
  BENGALI_INDIA = 'bnIN',
  FRENCH = 'fr',
  SPANISH = 'es',
  AMHARIC = 'am',
  FRENCH_CANADIAN = 'frCA',
  KANNADA = 'kn',
  OROMO = 'om',
  TAMIL = 'ta',
  TELUGU = 'TE',
  TIGRINYA = 'TI',
}

import { store, RootState } from '../redux/store'

export const DEFAULT_LANGUAGE_CODE = LanguageCode.ENGLISH

export const AVAILABLE_TRANSLATIONS: LanguageCode[] = [
  LanguageCode.AMHARIC,
  LanguageCode.BENGALI_INDIA,
  LanguageCode.BENGALI,
  LanguageCode.ENGLISH,
  LanguageCode.FRENCH,
  LanguageCode.FRENCH_CANADIAN,
  LanguageCode.HINDI,
  LanguageCode.KANNADA,
  LanguageCode.MARATHI,
  LanguageCode.OROMO,
  LanguageCode.PUNJABI,
  LanguageCode.SPANISH,
  LanguageCode.TAMIL,
  LanguageCode.TELUGU,
  LanguageCode.TIGRINYA,
]

import { enUS, fr, es, hi, bn, frCA, kn, ta, te } from 'date-fns/locale'

export const dateLocale = () => {
  const reduxState = store.getState() as RootState
  const code: LanguageCode = reduxState.patient.locale ?? DEFAULT_LANGUAGE_CODE
  switch (code) {
    case LanguageCode.BENGALI:
    case LanguageCode.BENGALI_INDIA:
      return bn
    case LanguageCode.FRENCH:
      return fr
    case LanguageCode.FRENCH_CANADIAN:
      return frCA
    case LanguageCode.HINDI:
      return hi
    case LanguageCode.KANNADA:
      return kn
    case LanguageCode.SPANISH:
      return es
    case LanguageCode.TAMIL:
      return ta
    case LanguageCode.TELUGU:
      return te
    default:
      return enUS
  }
}

export const languageCodeToDisplayTitle = (code: LanguageCode) => {
  switch (code) {
    case LanguageCode.AMHARIC:
      return 'አማርኛ'
    case LanguageCode.BENGALI:
      return 'বাংলা'
    case LanguageCode.BENGALI_INDIA:
      return 'বাঙালি'
    case LanguageCode.ENGLISH:
      return 'English'
    case LanguageCode.FRENCH:
      return 'Français'
    case LanguageCode.FRENCH_CANADIAN:
      return 'Français (Canada)'
    case LanguageCode.HINDI:
      return 'हिन्दी'
    case LanguageCode.KANNADA:
      return 'ಕನ್ನಡ'
    case LanguageCode.MARATHI:
      return 'मराठी'
    case LanguageCode.OROMO:
      return 'Oromo'
    case LanguageCode.PUNJABI:
      return 'ਪੰਜਾਬੀ'
    case LanguageCode.SPANISH:
      return 'Español'
    case LanguageCode.TAMIL:
      return 'தமிழ்'
    case LanguageCode.TELUGU:
      return 'తెలుగు'
    case LanguageCode.TIGRINYA:
      return 'ትግርኛ'
  }
}

export const translationsForCode = (code: LanguageCode) => {
  switch (code) {
    case LanguageCode.AMHARIC:
      return amTranslations
    case LanguageCode.BENGALI:
      return bnTranslations
    case LanguageCode.BENGALI_INDIA:
      return bnInTranslations
    case LanguageCode.ENGLISH:
      return enTranslations
    case LanguageCode.FRENCH:
      return frTranslations
    case LanguageCode.FRENCH_CANADIAN:
      return frCATranslations
    case LanguageCode.HINDI:
      return hiTranslations
    case LanguageCode.KANNADA:
      return knTranslations
    case LanguageCode.MARATHI:
      return mrTranslations
    case LanguageCode.OROMO:
      return omTranslations
    case LanguageCode.PUNJABI:
      return paTranslations
    case LanguageCode.SPANISH:
      return esTranslations
    case LanguageCode.TAMIL:
      return taTranslations
    case LanguageCode.TELUGU:
      return teTranslations
    case LanguageCode.TIGRINYA:
      return tiTranslations
  }
}
