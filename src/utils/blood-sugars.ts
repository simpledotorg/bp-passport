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

export const showWarning = (bs: BloodSugar): boolean => {
  if (isLowBloodSugar(bs)) {
    return true
  }

  const warningHighBSValue = getBloodSugarDetails(bs).warningHigh
  if (warningHighBSValue === undefined || warningHighBSValue === null) {
    return false
  }

  const value = Number(bs.blood_sugar_value)
  return value !== undefined && value >= warningHighBSValue
}

export const isHighBloodSugar = (bs: BloodSugar) => {
  return Number(bs.blood_sugar_value) >= getBloodSugarDetails(bs).high
}

export const isLowBloodSugar = (bs: BloodSugar) => {
  const lowBSValue = getBloodSugarDetails(bs).low
  if (lowBSValue === undefined || lowBSValue === null) {
    return false
  }

  return Number(bs.blood_sugar_value) < lowBSValue
}

export const getBloodSugarDetails: (
  bs: BloodSugar,
) => {
  warningHigh?: number
  high: number
  low?: number
  languageKey: string
  languageTypeCode: string
} = (bs: BloodSugar) => {
  switch (bs.blood_sugar_type) {
    case BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR: {
      return {
        warningHigh: 300,
        high: 126,
        low: 70,
        languageKey: 'bs.fasting-blood-sugar',
        languageTypeCode: 'bs.fasting-code',
      }
    }
    case BLOOD_SUGAR_TYPES.POST_PRANDIAL: {
      return {
        warningHigh: 300,
        high: 200,
        low: 70,
        languageKey: 'bs.post-prandial',
        languageTypeCode: 'bs.post-prenial-code',
      }
    }
    case BLOOD_SUGAR_TYPES.HEMOGLOBIC: {
      return {
        high: 7,
        languageKey: 'bs.hemoglobic',
        languageTypeCode: 'bs.hemoglobic-code',
      }
    }
    case BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR:
    default: {
      return {
        warningHigh: 300,
        high: 200,
        low: 70,
        languageKey: 'bs.random-blood-sugar',
        languageTypeCode: 'bs.random-blood-code',
      }
    }
  }
}

declare global {
  interface Array<T> {
    // tslint:disable-next-line: array-type
    filterByTypes(types: BLOOD_SUGAR_TYPES[]): Array<T>

    // tslint:disable-next-line: array-type
    filterByType(type: BLOOD_SUGAR_TYPES): Array<T>

    hasReadingType(types: BLOOD_SUGAR_TYPES): boolean

    // tslint:disable-next-line: array-type
    filterForYear(year: number): Array<T>

    // tslint:disable-next-line: array-type
    filterForMonthAndYear(month: number, year: number): Array<T>

    oldest(): T | null

    mostRecent(): T | null
  }
}

if (!Array.prototype.mostRecent) {
  Array.prototype.mostRecent = function <T extends BloodSugar>(
    this: T[],
  ): T | null {
    return this.reduce((memo: T | null, current: T): T => {
      return memo == null ||
        new Date(current.recorded_at) > new Date(memo.recorded_at)
        ? current
        : memo
    }, null)
  }
}

if (!Array.prototype.oldest) {
  Array.prototype.oldest = function <T extends BloodSugar>(
    this: T[],
  ): T | null {
    return this.reduce((memo: T | null, current: T): T => {
      return memo == null ||
        new Date(current.recorded_at) < new Date(memo.recorded_at)
        ? current
        : memo
    }, null)
  }
}

if (!Array.prototype.filterByTypes) {
  Array.prototype.filterByTypes = function <T extends BloodSugar>(
    this: T[],
    types: BLOOD_SUGAR_TYPES[],
  ): T[] {
    return this.filter((reading) => {
      return types.find((type) => {
        return type === reading.blood_sugar_type
      })
    })
  }
}

if (!Array.prototype.filterByType) {
  Array.prototype.filterByType = function <T extends BloodSugar>(
    this: T[],
    type: BLOOD_SUGAR_TYPES,
  ): T[] {
    return this.filter((reading) => {
      return type === reading.blood_sugar_type
    })
  }
}

if (!Array.prototype.hasReadingType) {
  Array.prototype.hasReadingType = function <T extends BloodSugar>(
    this: T[],
    type: BLOOD_SUGAR_TYPES,
  ): boolean {
    return (
      this.find((reading) => {
        return reading.blood_sugar_type === type
      }) !== undefined
    )
  }
}

if (!Array.prototype.filterForMonthAndYear) {
  Array.prototype.filterForMonthAndYear = function <T extends BloodSugar>(
    this: T[],
    month: number,
    year: number,
  ): T[] {
    const monthToCheck = month - 1
    console.log({monthToCheck, month, year})
    return this.filter((reading) => {
      const date = new Date(reading.recorded_at)
      return date.getMonth() === monthToCheck && date.getFullYear() === year
    })
  }
}

if (!Array.prototype.filterForYear) {
  Array.prototype.filterForYear = function <T extends BloodSugar>(
    this: T[],
    year: number,
  ): T[] {
    return this.filter((reading) => {
      const date = new Date(reading.recorded_at)
      return date.getFullYear() === year
    })
  }
}
