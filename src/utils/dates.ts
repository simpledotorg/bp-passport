import {
  subMonths,
  format,
  startOfMonth,
  endOfMonth,
  addDays,
  addMonths,
  addWeeks,
  endOfDay,
  addMinutes,
  eachDayOfInterval,
} from 'date-fns'
import {zonedTimeToUtc} from 'date-fns-tz'
import {BloodPressure} from '../redux/blood-pressure/blood-pressure.models'
import {BloodSugar} from '../redux/blood-sugar/blood-sugar.models'

export interface DateRange {
  date: Date
  list: (BloodPressure | BloodSugar)[]
  averaged: any
  index: number
}

export const CHART_MONTH_RANGE = 4

export const getChartDateRange = () => {
  const end = new Date()
  const start = zonedTimeToUtc(
    subMonths(startOfMonth(end), CHART_MONTH_RANGE - 1),
    'UTC',
  )

  const eachDay = eachDayOfInterval({
    start,
    end,
  })

  return eachDay.map((day, index) => {
    return {
      index,
      date: day,
      list: [],
      averaged: {},
    }
  })
}
