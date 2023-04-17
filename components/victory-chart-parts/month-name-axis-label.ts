import { IDefineAdateAxisLabel } from './i-define-a-date-axis-label'
import { format } from 'date-fns'
import { dateLocale } from '../../constants/languages'

export class MonthNameAxisLabel implements IDefineAdateAxisLabel {
  private _month: number
  private _monthName: string
  private _year: number

  public constructor(date: Date) {
    this._month = date.getMonth()
    this._monthName = format(date, 'MMM', {
      locale: dateLocale(),
    })
    this._year = date.getFullYear()
  }

  public get month(): number {
    return this._month
  }

  public get monthName(): string {
    return this._monthName
  }

  public get year(): number {
    return this._year
  }
}
