import {isWithinInterval} from 'date-fns'

import {BloodPressure} from '../redux/blood-pressure/blood-pressure.models'
import {BloodSugar} from '../redux/blood-sugar/blood-sugar.models'
import {getChartDateRange, DateRange} from './dates'

const getIndexFromBP = (
  dates: DateRange[],
  input: BloodPressure | BloodSugar,
): number => {
  let index = 0
  const found = dates.find((date, i) => {
    index = i
    return isWithinInterval(new Date(input.recorded_at), date.interval)
  })
  if (found) {
    return index
  } else {
    return 0
  }
}

export const generateChartData = (
  input: BloodPressure[] | BloodSugar[],
  calculateAverate: (current: DateRange) => number | {},
  isHigh: (value: any) => boolean,
) => {
  const dates: DateRange[] = getChartDateRange()

  input.forEach((value: BloodPressure | BloodSugar) => {
    const index = getIndexFromBP(dates, value)

    if (dates[index]) {
      dates[index].list.push(value)
    }
  })

  const reduction = dates.reduce(
    (memo: {high: []; low: []}, current) => {
      if (current.list.length) {
        const average: any = calculateAverate(current)

        if (isHigh(average)) {
          memo.high.push({...current, averaged: average})
        } else {
          memo.low.push({...current, averaged: average})
        }
      }
      return memo
    },
    {high: [], low: []},
  )

  return {dates, low: reduction.low, high: reduction.high}
}
