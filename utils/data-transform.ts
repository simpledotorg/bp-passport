import { isSameDay } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'

import { BloodPressure } from '../redux/blood-pressure/blood-pressure.models'
import { BloodSugar } from '../redux/blood-sugar/blood-sugar.models'
import { getChartDateRange, DateRange } from './dates'

export const getIndexFromBP = (
  dates: DateRange[],
  input: BloodPressure | BloodSugar,
): number | null => {
  let index = 0
  const found = dates.find((date, i) => {
    index = i

    return isSameDay(
      new Date(input.recorded_at),
      zonedTimeToUtc(new Date(date.date), 'UTC'),
    )
  })
  if (found) {
    return index
  } else {
    return null
  }
}

const getMinValue = (value: BloodPressure | BloodSugar) => {
  if (value instanceof BloodPressure) {
    return value?.diastolic < value?.systolic
      ? value?.diastolic
      : value?.systolic
  } else {
    return value?.blood_sugar_value
  }
}

const getMaxValue = (value: BloodPressure | BloodSugar) => {
  if (value instanceof BloodPressure) {
    return value?.diastolic > value?.systolic
      ? value?.diastolic
      : value?.systolic
  } else {
    return value?.blood_sugar_value
  }
}

export const generateAverageChartData = (
  input: BloodPressure[] | BloodSugar[],
  calculateAverage: (current: DateRange) => number | object,
  isHigh: (value: number | object) => boolean,
) => {
  const dates: DateRange[] = getChartDateRange()

  let min: number | null = null
  let max: number | null = null

  input.forEach((value: BloodPressure | BloodSugar) => {
    const index = getIndexFromBP(dates, value)

    if (index) {
      const valueMin = Number(getMinValue(value))
      const valueMax = Number(getMaxValue(value))
      if (!min || valueMin < min) {
        min = valueMin
      }
      if (!max || valueMax > max) {
        max = valueMax
      }
      if (dates[index]) {
        dates[index].list.push(value)
      }
    }
  })

  const reduction = dates.reduce(
    (memo: { high: DateRange[]; low: DateRange[] }, current) => {
      if (current.list.length) {
        const average: number | object = calculateAverage(current)

        if (isHigh(average)) {
          memo.high.push({ ...current, averaged: average })
        } else {
          memo.low.push({ ...current, averaged: average })
        }
      }
      return memo
    },
    { high: [], low: [] },
  )

  return { dates, low: reduction.low, high: reduction.high, min, max }
}
