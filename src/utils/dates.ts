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

export const getChartDateRange = () => {
  const today = new Date()
  const monthCount = 5
  const start = subMonths(startOfMonth(today), monthCount - 1)
  const response = []
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
      },
      {
        interval: {
          start: addDays(currentMonth, 8),
          end: endOfDay(addDays(currentMonth, 15)),
        },
        list: [],
        averaged: {},
      },
      {
        interval: {
          start: addDays(currentMonth, 16),
          end: endOfDay(addDays(currentMonth, 23)),
        },
        list: [],
        averaged: {},
      },
      {
        interval: {
          start: addDays(currentMonth, 24),
          end: endOfDay(endOfMonth(currentMonth)),
        },
        list: [],
        averaged: {},
      },
    ]
    response.push(month)
    currentCount++
  }
  return response.flat()
}
