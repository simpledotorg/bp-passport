import {BLOOD_SUGAR_TYPES} from '../models'

export const SUGAR_TYPE_VALUES = {
  [BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR]: {
    high: 200,
    languageKey: 'bs.random-blood-sugar',
  },
  [BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR]: {
    high: 126,
    languageKey: 'bs.fasting-blood-sugar',
  },
  [BLOOD_SUGAR_TYPES.POST_PENIAL]: {
    high: 200,
    languageKey: 'bs.post-penial',
  },
  [BLOOD_SUGAR_TYPES.HEMOGLOBIC]: {
    high: 7,
    languageKey: 'bs.hemoglobic',
  },
}
