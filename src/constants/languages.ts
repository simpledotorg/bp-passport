export enum LanguageCode {
  ENGLISH = 'en',
  HINDI = 'hi',
  MARATHI = 'mr',
  PUNJABI = 'pa',
  FRENCH = 'fr',
  SPANISH = 'es',
}

export const DEFAULT_LANGUAGE_CODE = LanguageCode.ENGLISH

export const AVAILABLE_TRANSLATIONS: LanguageCode[] = [
  LanguageCode.ENGLISH,
  LanguageCode.HINDI,
  LanguageCode.MARATHI,
  LanguageCode.PUNJABI,
  LanguageCode.FRENCH,
  LanguageCode.SPANISH,
]

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
  }
}
