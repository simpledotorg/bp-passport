import {IntlShape} from 'react-intl'

export enum BLOOD_SUGAR_TYPES {
  RANDOM_BLOOD_SUGAR = 'random', // legacy, now becomes AFTER_EATING
  FASTING_BLOOD_SUGAR = 'fasting', // legacy, now becomes BEFORE_EATING
  POST_PRANDIAL = 'prandial', // legacy, now becomes AFTER_EATING
  HEMOGLOBIC = 'hemoglobic',
  BEFORE_EATING = 'before_eating',
  AFTER_EATING = 'after_eating',
}

export const BLOOD_SUGAR_TYPES_ORDERED = [
  BLOOD_SUGAR_TYPES.BEFORE_EATING,
  BLOOD_SUGAR_TYPES.AFTER_EATING,
  BLOOD_SUGAR_TYPES.HEMOGLOBIC,
]

export interface BloodSugar {
  blood_sugar_value: string
  blood_sugar_type: string
  recorded_at: string /* 2019-07-08T18:51:27.255Z */
  facility?: {
    country: string
    district: string
    name: string
    pin: string
    state: string
    street_address: string
    village_or_colony: string
  }
  offline?: boolean
  blood_sugar_unit?: string
}

export enum BLOOD_SUGAR_INPUT_TYPES {
  DECIMAL = 'DECIMAL',
  PERCENTAGE = 'PERCENTAGE',
}

export interface BloodSugarInfo {
  type: BLOOD_SUGAR_TYPES
  title: string
  subtitle: string
  min: number
  max: number
}

export const bloodSugarTypeToInfo = (
  type: BLOOD_SUGAR_TYPES,
  intl: IntlShape,
): BloodSugarInfo => {
  switch (type) {
    case BLOOD_SUGAR_TYPES.AFTER_EATING:
      return {
        type,
        title: intl.formatMessage({
          id: 'bs.after-eating-title',
        }),
        subtitle: intl.formatMessage({
          id: 'bs.after-eating-description',
        }),
        min: 30,
        max: 1000,
      }
    case BLOOD_SUGAR_TYPES.BEFORE_EATING:
      return {
        type,
        title: intl.formatMessage({
          id: 'bs.before-eating-title',
        }),
        subtitle: intl.formatMessage({
          id: 'bs.before-eating-description',
        }),
        min: 30,
        max: 1000,
      }
    case BLOOD_SUGAR_TYPES.HEMOGLOBIC:
      return {
        type,
        title: intl.formatMessage({
          id: 'bs.hemoglobic-code',
        }),
        subtitle: intl.formatMessage({
          id: 'bs.hemoglobic-description',
        }),
        min: 3,
        max: 25,
      }
  }
  return {
    type,
    title: 'not found',
    subtitle: 'todo',
    min: 0,
    max: 0,
  }
}
