import { format } from 'date-fns'
import { dateLocale } from '../../constants/languages'

export class DateEntry {
  private date: Date
  private index: number

  constructor(dateValue: Date, index: number) {
    this.date = dateValue
    this.index = index
  }

  getIndex(): number {
    return this.index
  }

  getDate(): Date {
    return this.date
  }

  getMonthPart(): string {
    return format(this.date, 'MMM', {
      locale: dateLocale(),
    })
  }

  getYearPart(): string {
    return format(this.date, 'YYY', {
      locale: dateLocale(),
    })
  }

  isSameDate(dateToCheck: Date): boolean {
    return (
      this.date.getUTCDate() === dateToCheck.getUTCDate() &&
      this.date.getUTCMonth() === dateToCheck.getUTCMonth() &&
      this.date.getUTCFullYear() === dateToCheck.getUTCFullYear()
    )
  }
}
