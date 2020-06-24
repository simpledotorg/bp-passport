import {IDefineAdateAxisLabel} from './i-define-a-date-axis-label'
import {format} from 'date-fns'
import {dateLocale} from '../../constants/languages'

export class MonthInitialAxisLabel implements IDefineAdateAxisLabel {
  private _monthInitial: string
  private _month: number
  private _year: number

  public constructor(date: Date) {
    this._monthInitial = format(date, 'MMM', {
      locale: dateLocale(),
    })[0]

    this._month = date.getMonth()
    this._year = date.getFullYear()
  }

  public get monthInitial(): string {
    return this._monthInitial
  }

  public get month(): number {
    return this._month
  }

  public get year(): number {
    return this._year
  }
}
