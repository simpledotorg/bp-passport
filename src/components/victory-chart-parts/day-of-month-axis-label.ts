import {IDefineAdateAxisLabel} from './i-define-a-date-axis-label'

export class DayOfMonthAxisLabel implements IDefineAdateAxisLabel {
  private _dayOfMonth: number

  public constructor(dayOfMonth: number) {
    this._dayOfMonth = dayOfMonth
  }

  public get dayOfMonth(): number {
    return this._dayOfMonth
  }
}
