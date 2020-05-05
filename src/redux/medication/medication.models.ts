export interface Medication {
  name: string
  rxnorm_code?: string
  dosage?: string
  is_protocol_drug?: boolean
  offline?: boolean
  reminder?: Reminder
  updated_at?: string
}

export interface Reminder {
  days: string /* 0123456 (0=Sunday, 1=Monday etc) */
  dayOffset: number /* seconds from midnight for the daily reminders */
}

export const createAMedicationWithReminder = (name: string): Medication => {
  return {
    name,
    offline: true,
    reminder: createAReminder(),
  }
}

export const createAReminder = (): Reminder => {
  return {
    days: DAILY,
    dayOffset: 8 * 60 * 60,
  }
}

export enum Day {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

const displayPriorityForDay = (day: Day): number => {
  switch (day) {
    case Day.Monday:
      return 0
    case Day.Tuesday:
      return 1
    case Day.Wednesday:
      return 2
    case Day.Thursday:
      return 3
    case Day.Friday:
      return 4
    case Day.Saturday:
      return 5
    case Day.Sunday:
      return 6
  }
}

export const ordedDays = (arrayOfDays: Day[]): string => {
  const ordered = arrayOfDays.sort((a, b) => {
    return displayPriorityForDay(a) - displayPriorityForDay(b)
  })
  return ordered.join('')
}

export const ALL_DAYS_ORDERED = [
  Day.Monday,
  Day.Tuesday,
  Day.Wednesday,
  Day.Thursday,
  Day.Friday,
  Day.Saturday,
  Day.Sunday,
]

export const DAILY = ALL_DAYS_ORDERED.join('')

export const WEEK_DAYS = [
  Day.Monday,
  Day.Tuesday,
  Day.Wednesday,
  Day.Thursday,
  Day.Friday,
].join('')

export const WEEKENDS = [Day.Saturday, Day.Sunday].join('')

export const frequencyText = (days: string) => {
  if (days === DAILY) {
    return 'medicine.daily'
  }

  if (days === WEEK_DAYS) {
    return 'medicine.weekdays'
  }

  if (days === WEEKENDS) {
    return 'medicine.weekends'
  }

  if (days.length === 1) {
    const day: Day = Number(days)
    return dayToKeyString(day)
  }

  return 'medicine.custom'
}

export const dayToKeyString = (day: Day) => {
  switch (day) {
    case Day.Monday:
      return 'general.mondays'
    case Day.Tuesday:
      return 'general.tuesdays'
    case Day.Wednesday:
      return 'general.wednesdays'
    case Day.Thursday:
      return 'general.thursdays'
    case Day.Friday:
      return 'general.fridays'
    case Day.Saturday:
      return 'general.saturdays'
    case Day.Sunday:
      return 'general.sundays'
  }
}

export const dateForDayOffset = (
  dayOffset: number /* seconds since midnight*/,
  day: Date = new Date(),
) => {
  const midnight = new Date(day.getTime())
  midnight.setHours(0, 0, 0, 0)
  return new Date(midnight.getTime() + dayOffset * 1000)
}

export const dayOffsetForDate = (date: Date) => {
  const midnight = new Date(date.getTime())
  midnight.setHours(0, 0, 0, 0)
  return Math.round((date.getTime() - midnight.getTime()) / 1000)
}
