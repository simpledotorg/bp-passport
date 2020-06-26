import {
  differenceInDays,
  addDays,
  addMonths,
  differenceInMonths,
} from 'date-fns'
import {DateEntry} from './date-entry'
import {BloodSugar} from '../../redux/blood-sugar/blood-sugar.models'
import {BloodPressure} from '../../redux/blood-pressure/blood-pressure.models'
import {IDefineAdateAxisLabel} from '../victory-chart-parts/i-define-a-date-axis-label'
import {MonthNameAxisLabel} from '../victory-chart-parts/month-name-axis-label'
import {DayOfMonthAxisLabel} from '../victory-chart-parts/day-of-month-axis-label'
import {MonthInitialAxisLabel} from '../victory-chart-parts/month-initial-axis-label'

export class DateAxis {
  private dates: DateEntry[]
  private tickValues: IDefineAdateAxisLabel[]

  private static populateTickValuesForAMonth(
    dates: DateEntry[],
  ): DayOfMonthAxisLabel[] {
    const values: DayOfMonthAxisLabel[] = []

    const separator = Math.floor(dates.length / 4)

    values.push(new DayOfMonthAxisLabel(1))
    values.push(new DayOfMonthAxisLabel(1 + separator))
    values.push(new DayOfMonthAxisLabel(1 + separator * 2))
    values.push(new DayOfMonthAxisLabel(1 + separator * 3))

    return values
  }

  private static populateTickValuesForAYear(
    dateEntries: DateEntry[],
  ): MonthInitialAxisLabel[] {
    const values: MonthInitialAxisLabel[] = []
    dateEntries.forEach((dateEntry) => {
      if (
        !values.find((value) => {
          return (
            value.month === dateEntry.getDate().getMonth() &&
            value.year === dateEntry.getDate().getFullYear()
          )
        })
      ) {
        values.push(new MonthInitialAxisLabel(dateEntry.getDate()))
      }
    })
    return values
  }

  private static populateTickValuesForYears(
    dateEntries: DateEntry[],
  ): MonthNameAxisLabel[] {
    const values: MonthNameAxisLabel[] = []
    dateEntries.forEach((dateEntry) => {
      if (
        values.length === 0 ||
        !values.find((value) => {
          return (
            value.month === dateEntry.getDate().getMonth() &&
            value.year === dateEntry.getDate().getFullYear()
          )
        })
      ) {
        values.push(new MonthNameAxisLabel(dateEntry.getDate()))
      }
    })

    return values
  }

  private constructor(startDate: Date, endDate: Date) {
    const numberOfDays = differenceInDays(endDate, startDate) + 1

    this.dates = [...Array(numberOfDays)].map((_, index) => {
      return new DateEntry(addDays(startDate, index), index)
    })

    const months = Math.abs(differenceInMonths(endDate, startDate))

    if (months === 0) {
      this.tickValues = DateAxis.populateTickValuesForAMonth(this.dates)
    } else if (months < 12) {
      this.tickValues = DateAxis.populateTickValuesForAYear(this.dates)
    } else {
      this.tickValues = DateAxis.populateTickValuesForYears(this.dates)
    }
  }

  public static CreateForRequestedMonth(
    requestedMonth: number,
    requestedYear: number,
  ): DateAxis {
    const startDate = new Date(Date.UTC(requestedYear, requestedMonth, 1))
    const endDate = addDays(addMonths(startDate, 1), -1)

    return new DateAxis(startDate, endDate)
  }

  public static CreateForYear(requestedYear: number) {
    const startDate = new Date(Date.UTC(requestedYear, 0, 1))
    const endDate = addDays(addMonths(startDate, 12), -1)

    return new DateAxis(startDate, endDate)
  }

  public static CreateMostRecentMonthsFromBloodPressures(
    bloodPressures: BloodPressure[],
    monthRange: number,
  ): DateAxis {
    const lastDateValue = bloodPressures.reduce(
      (memo: Date | null, current: BloodPressure): Date => {
        const currentDate = new Date(current.recorded_at)
        return memo == null || currentDate > memo ? currentDate : memo
      },
      null,
    )

    if (lastDateValue == null) {
      throw new Error('Can not find last date')
    }

    const endDate = DateAxis.ceilingDate(lastDateValue)
    const startDate = DateAxis.floorDate(
      addMonths(endDate, (monthRange - 1) * -1),
    )

    return new DateAxis(startDate, endDate)
  }

  private static ceilingDate(date: Date): Date {
    return addDays(addMonths(DateAxis.floorDate(date), 1), -1)
  }

  private static floorDate(date: Date): Date {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1))
  }

  public getDateEntryForBloodPressure(
    record: BloodPressure,
  ): DateEntry | undefined {
    const dateToFind = new Date(record.recorded_at)

    return this.dates.find((date) => {
      return date.isSameDate(dateToFind)
    })
  }

  public getDates(): DateEntry[] {
    return this.dates
  }

  public getTickCount(): number {
    return this.dates.length
  }

  public getAxisTickValues(): IDefineAdateAxisLabel[] {
    return this.tickValues
  }
}
