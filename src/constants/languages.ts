import enTranslations from '../../translations/master.json'
import hiTranslations from '../translations/strings_hi_IN.json'
import mrTranslations from '../translations/strings_mr_IN.json'
import paTranslations from '../translations/strings_pa_IN.json'
import frTranslations from '../translations/strings_fr.json'
import esTranslations from '../translations/strings_es.json'
import bnTranslations from '../translations/strings_bn.json'

export enum LanguageCode {
  ENGLISH = 'en',
  HINDI = 'hi',
  MARATHI = 'mr',
  PUNJABI = 'pa',
  BENGALI = 'bn',
  FRENCH = 'fr',
  SPANISH = 'es',
}

import {enUS, fr, es, hi, bn} from 'date-fns/locale'
import {store, RootState} from '../redux/store'
/*export enum LanguageCode {
  ENGLISH = 'en',
  HINDI = 'hi',
  MARATHI = 'mr',
  PUNJABI = 'pa',
  FRENCH = 'fr',
  SPANISH = 'es',
} */

export const DEFAULT_LANGUAGE_CODE = LanguageCode.ENGLISH

export const AVAILABLE_TRANSLATIONS: LanguageCode[] = [
  LanguageCode.ENGLISH,
  LanguageCode.HINDI,
  /* LanguageCode.MARATHI,*/
  LanguageCode.BENGALI,
  LanguageCode.PUNJABI,
  LanguageCode.FRENCH,
  LanguageCode.SPANISH,
]

export const dateLocale = () => {
  const reduxState = store.getState() as RootState
  const code: LanguageCode = reduxState.patient.locale ?? DEFAULT_LANGUAGE_CODE
  switch (code) {
    case LanguageCode.HINDI:
      return hi
    case LanguageCode.BENGALI:
      // console.log('YOYO: ', bn)
      return bn
    case LanguageCode.FRENCH:
      return fr
    case LanguageCode.SPANISH:
      return es
    default:
      return enUS
  }
}

export const languageCodeToDisplayTitle = (code: LanguageCode) => {
  switch (code) {
    case LanguageCode.ENGLISH:
      return 'English'
    case LanguageCode.HINDI:
      return 'हिन्दी'
    case LanguageCode.MARATHI:
      return 'मराठी'
    case LanguageCode.PUNJABI:
      return 'ਪੰਜਾਬੀ'
    case LanguageCode.FRENCH:
      return 'Français'
    case LanguageCode.SPANISH:
      return 'Español'
    case LanguageCode.BENGALI:
      return 'বাংলা'
  }
}

export const translationsForCode = (code: LanguageCode) => {
  switch (code) {
    case LanguageCode.ENGLISH:
      return enTranslations
    case LanguageCode.HINDI:
      return hiTranslations
    case LanguageCode.MARATHI:
      return mrTranslations
    case LanguageCode.PUNJABI:
      return paTranslations
    case LanguageCode.FRENCH:
      return frTranslations
    case LanguageCode.SPANISH:
      return esTranslations
    case LanguageCode.BENGALI:
      return bnTranslations
  }
}
