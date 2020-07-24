import {format} from 'date-fns'

import {
  BloodSugar,
  BLOOD_SUGAR_TYPES,
} from '../redux/blood-sugar/blood-sugar.models'
import {dateLocale} from '../constants/languages'
import {BloodPressure} from '../redux/blood-pressure/blood-pressure.models'
import {useIntl} from 'react-intl'
import ConvertedBloodSugarReading from '../models/converted_blood_sugar_reading'

export const displayDate = (bsIn: BloodSugar | ConvertedBloodSugarReading) => {
  return bsIn.recorded_at
    ? format(new Date(bsIn.recorded_at), `dd-MMM-yyy`, {
        locale: dateLocale(),
      })
    : null
}

export const showWarning = (bs: ConvertedBloodSugarReading): boolean => {
  if (isLowBloodSugar(bs)) {
    return true
  }

  if (isHighBloodSugar(bs)) {
    return true
  }

  return false
}

export const isHighBloodSugar = (bs: ConvertedBloodSugarReading) => {
  return bs.value >= getBloodSugarDetails(bs).high
}

export const isLowBloodSugar = (bs: ConvertedBloodSugarReading) => {
  const lowBSValue = getBloodSugarDetails(bs).low
  if (lowBSValue === undefined || lowBSValue === null) {
    return false
  }

  return bs.blood_sugar_unit === BloodSugarCode.MMOL_L
    ? bs.value < lowBSValue
    : bs.value < lowBSValue
}

export const getBloodSugarDetails: (
  bs: ConvertedBloodSugarReading,
) => {
  type: BLOOD_SUGAR_TYPES
  warningHigh?: number
  high: number
  low?: number
} = (bs: ConvertedBloodSugarReading) => {
  const commonLow = bs.blood_sugar_unit === BloodSugarCode.MG_DL ? 70 : 3.9
  const commonWarningHight =
    bs.blood_sugar_unit === BloodSugarCode.MG_DL ? 300 : 16.7
  const afterEatingHigh =
    bs.blood_sugar_unit === BloodSugarCode.MG_DL ? 200 : 11.1
  const beforeEatingLow = bs.blood_sugar_unit === BloodSugarCode.MG_DL ? 126 : 7

  switch (bs.blood_sugar_type) {
    case BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR: {
      return {
        type: BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR,
        warningHigh: commonWarningHight,
        high: beforeEatingLow,
        low: commonLow,
      }
    }
    case BLOOD_SUGAR_TYPES.POST_PRANDIAL: {
      return {
        type: BLOOD_SUGAR_TYPES.POST_PRANDIAL,
        warningHigh: commonWarningHight,
        high: afterEatingHigh,
        low: commonLow,
      }
    }
    case BLOOD_SUGAR_TYPES.HEMOGLOBIC: {
      return {
        type: BLOOD_SUGAR_TYPES.HEMOGLOBIC,
        high: 7,
        languageKey: 'bs.hemoglobic',
      }
    }
    case BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR:
      return {
        type: BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR,
        warningHigh: commonWarningHight,
        high: afterEatingHigh,
        low: commonLow,
      }
    case BLOOD_SUGAR_TYPES.BEFORE_EATING:
      return {
        type: BLOOD_SUGAR_TYPES.BEFORE_EATING,
        warningHigh: commonWarningHight,
        high: beforeEatingLow,
        low: commonLow,
      }
    case BLOOD_SUGAR_TYPES.AFTER_EATING:
    default:
      return {
        type: BLOOD_SUGAR_TYPES.AFTER_EATING,
        warningHigh: commonWarningHight,
        high: afterEatingHigh,
        low: commonLow,
      }
  }
}

export enum BloodSugarCode {
  MMOL_L = 'mmol/L',
  MG_DL = 'mg/dL',
  PERCENT = '%',
}

const toCorrectPrecision = (
  value?: number | string,
  displayUnits?: string,
): number => {
  const castValue = value
    ? typeof value === 'string'
      ? Number(value)
      : value
    : 0

  return Number(
    castValue.toFixed(determinePrecision(displayUnits ?? BloodSugarCode.MG_DL)),
  )
}

export const determinePrecision = (
  displayUnits: BloodSugarCode | string,
): number => (displayUnits === BloodSugarCode.MMOL_L ? 1 : 0)

export const AVAILABLE_BLOOD_SUGAR_UNITS: BloodSugarCode[] = [
  BloodSugarCode.MG_DL,
  BloodSugarCode.MMOL_L,
]

export const bloodSugarUnitToDisplayTitle = (code: BloodSugarCode) => {
  const intl = useIntl()

  switch (code) {
    case BloodSugarCode.MMOL_L:
      return intl.formatMessage({id: 'bs.mmoll'})
    case BloodSugarCode.MG_DL:
      return intl.formatMessage({id: 'bs.mgdl'})
    default:
      return code
  }
}

const UNIT_CONVERSION_FACTOR = 18.0

export const convertBloodSugarReading = (
  bloodSugarReading: BloodSugar,
  convertTo: BloodSugarCode,
): number => {
  return convertBloodSugar(
    convertTo,
    bloodSugarReading,
    undefined,
    undefined,
    undefined,
  )
}

export const convertBloodSugarValue = (
  convertTo: BloodSugarCode,
  bloodSugarType: string,
  bloodSugarValue: string,
  bloodSugarUnit?: string,
): number => {
  return convertBloodSugar(
    convertTo,
    undefined,
    bloodSugarType,
    bloodSugarValue,
    bloodSugarUnit,
  )
}

const convertBloodSugar = (
  convertTo: BloodSugarCode,
  bloodSugarReading?: BloodSugar,
  bloodSugarType?: string,
  bloodSugarValue?: string,
  bloodSugarUnit?: string,
): number => {
  if (bloodSugarReading) {
    bloodSugarType = bloodSugarReading.blood_sugar_type
    bloodSugarValue = bloodSugarReading.blood_sugar_value
    bloodSugarUnit = bloodSugarReading.blood_sugar_unit
  }

  if (bloodSugarType === BLOOD_SUGAR_TYPES.HEMOGLOBIC) {
    return toCorrectPrecision(bloodSugarValue, convertTo)
  }

  const readingUnit = bloodSugarUnit ?? BloodSugarCode.MG_DL

  if (readingUnit === convertTo) {
    return toCorrectPrecision(bloodSugarValue, convertTo)
  }

  if (
    readingUnit === BloodSugarCode.MG_DL &&
    convertTo === BloodSugarCode.MMOL_L
  ) {
    return toCorrectPrecision(
      Number(bloodSugarValue) / UNIT_CONVERSION_FACTOR,
      convertTo,
    )
  }

  if (
    readingUnit === BloodSugarCode.MMOL_L &&
    convertTo === BloodSugarCode.MG_DL
  ) {
    return toCorrectPrecision(
      Number(bloodSugarValue) * UNIT_CONVERSION_FACTOR,
      convertTo,
    )
  }

  throw new Error('Unhandled reading/display unit combination')
}

export const getDisplayBloodSugarUnit = (convertTo: BloodSugarCode): string => {
  return bloodSugarUnitToDisplayTitle(convertTo)
}

export const getReadingType = (
  bs: BloodSugar | ConvertedBloodSugarReading,
): string => {
  return useIntl().formatMessage({id: getReadingTypeId(bs)})
}

export const getReadingTypeId = (
  bs: BloodSugar | ConvertedBloodSugarReading,
): string => {
  switch (bs.blood_sugar_type) {
    case BLOOD_SUGAR_TYPES.HEMOGLOBIC:
      return 'bs.hemoglobic-code'

    case BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR:
    case BLOOD_SUGAR_TYPES.BEFORE_EATING:
      return 'bs.before-eating-title'

    case BLOOD_SUGAR_TYPES.POST_PRANDIAL:
    case BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR:
    case BLOOD_SUGAR_TYPES.AFTER_EATING:
    default:
      return 'bs.after-eating-title'
  }
}

export const simplifyBloodSugarReadingType = (
  bsType: BLOOD_SUGAR_TYPES,
): BLOOD_SUGAR_TYPES => {
  switch (bsType) {
    case BLOOD_SUGAR_TYPES.HEMOGLOBIC:
      return BLOOD_SUGAR_TYPES.HEMOGLOBIC
    case BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR:
    case BLOOD_SUGAR_TYPES.BEFORE_EATING:
      return BLOOD_SUGAR_TYPES.BEFORE_EATING
    default:
      return BLOOD_SUGAR_TYPES.AFTER_EATING
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
  Array.prototype.mostRecent = function <T extends BloodSugar | BloodPressure>(
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
  Array.prototype.oldest = function <T extends BloodSugar | BloodPressure>(
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
      const typeSimplified = simplifyBloodSugarReadingType(
        reading.blood_sugar_type as BLOOD_SUGAR_TYPES,
      )
      return types.find((type) => {
        return type === typeSimplified
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
      const typeSimplified = simplifyBloodSugarReadingType(
        reading.blood_sugar_type as BLOOD_SUGAR_TYPES,
      )
      return typeSimplified === type
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
    return this.filter((reading) => {
      const date = new Date(reading.recorded_at)
      return date.getMonth() === month && date.getFullYear() === year
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
