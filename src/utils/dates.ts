import {
  subMonths,
  format,
  startOfMonth,
  endOfMonth,
  addDays,
  addMonths,
  addWeeks,
  endOfDay,
} from 'date-fns'
import {BloodPressure} from '../redux/blood-pressure/blood-pressure.models'
import {BloodSugar} from '../redux/blood-sugar/blood-sugar.models'

export interface DateRange {
  interval: {start: Date; end: Date}
  list: (BloodPressure | BloodSugar)[]
  averaged: any
  index: number
}

export const getChartDateRange = () => {
  const today = new Date()
  const monthCount = 5
  const start = subMonths(startOfMonth(today), monthCount - 1)
  const response: any[] = []
  let currentCount = 0

  while (currentCount < monthCount) {
    const currentMonth: Date = addMonths(start, currentCount)
    const month = [
      {
        interval: {
          start: currentMonth,
          end: endOfDay(addDays(currentMonth, 7)),
        },
        list: [],
        averaged: {},
        index: currentCount * 4 + 0,
      },
      {
        interval: {
          start: addDays(currentMonth, 8),
          end: endOfDay(addDays(currentMonth, 15)),
        },
        list: [],
        averaged: {},
        index: currentCount * 4 + 1,
      },
      {
        interval: {
          start: addDays(currentMonth, 16),
          end: endOfDay(addDays(currentMonth, 23)),
        },
        list: [],
        averaged: {},
        index: currentCount * 4 + 2,
      },
      {
        interval: {
          start: addDays(currentMonth, 24),
          end: endOfDay(endOfMonth(currentMonth)),
        },
        list: [],
        averaged: {},
        index: currentCount * 4 + 3,
      },
    ]
    response.push(month)
    currentCount++
  }
  console.log('response', response.length)
  return response.flat()
}
