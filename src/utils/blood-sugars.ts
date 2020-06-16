import {format} from 'date-fns'

import {
  BloodSugar,
  BLOOD_SUGAR_TYPES,
} from '../redux/blood-sugar/blood-sugar.models'
import {dateLocale} from '../constants/languages'

export const displayDate = (bsIn: BloodSugar) => {
  return bsIn.recorded_at
    ? format(new Date(bsIn.recorded_at), `dd-MMM-yyy',' h:mm a`, {
        locale: dateLocale(),
      })
    : null
}

export const isHighBloodSugar = (bs: BloodSugar) => {
  return Number(bs.blood_sugar_value) >= getBloodSugarDetails(bs).high
}

export const isLowBloodSugar = (bs: BloodSugar) => {
  return Number(bs.blood_sugar_value) <= getBloodSugarDetails(bs).low
}

export const getBloodSugarDetails: (
  bs: BloodSugar,
) => {
  high: number
  low: number
  languageKey: string
  languageTypeCode: string
} = (bs: BloodSugar) => {
  switch (bs.blood_sugar_type) {
    case BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR: {
      return {
        high: 126,
        low: 50,
        languageKey: 'bs.fasting-blood-sugar',
        languageTypeCode: 'bs.fasting-code',
      }
    }
    case BLOOD_SUGAR_TYPES.POST_PRANDIAL: {
      return {
        high: 200,
        low: 70,
        languageKey: 'bs.post-prandial',
        languageTypeCode: 'bs.post-prenial-code',
      }
    }
    case BLOOD_SUGAR_TYPES.HEMOGLOBIC: {
      return {
        high: 7,
        low: 4,
        languageKey: 'bs.hemoglobic',
        languageTypeCode: 'bs.hemoglobic-code',
      }
    }
    case BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR:
    default: {
      return {
        high: 200,
        low: 70,
        languageKey: 'bs.random-blood-sugar',
        languageTypeCode: 'bs.random-blood-code',
      }
    }
  }
}
