import {subMonths, startOfMonth, endOfMonth, addDays} from 'date-fns'
import {BloodPressure} from '../redux/blood-pressure/blood-pressure.models'
import {BloodSugar} from '../redux/blood-sugar/blood-sugar.models'
import {isBefore} from 'date-fns/esm'
import {format} from 'date-fns'
import {dateLocale} from '../constants/languages'

export interface DateRange {
  date: Date
  list: (BloodPressure | BloodSugar)[]
  averaged: any
  index: number
}

export const CHART_MONTH_RANGE = 4

export const getChartDateRange = () => {
  const end = endOfMonth(new Date())
  const start = subMonths(startOfMonth(end), CHART_MONTH_RANGE - 1)

  const result = []
  let currentDay = start
  let index = 0

  while (isBefore(currentDay, end)) {
    result.push({
      index,
      date: currentDay,
      list: [],
      averaged: {},
    })

    index = index + 1
    currentDay = addDays(currentDay, 1)
  }

  return result
}

export const getMonthName = (monthIndex: number, year: number) => {
  return format(new Date(year, monthIndex, 1), 'MMM', {
    locale: dateLocale(),
  })
}

export const getMonthYearTitle = (monthIndex: number, year: number) => {
  return `${getMonthName(monthIndex, year)}-${year}`
}
