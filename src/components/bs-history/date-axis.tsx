import {differenceInDays, addDays} from 'date-fns'
import {DateEntry} from './date-entry'
import {BloodSugar} from '../../redux/blood-sugar/blood-sugar.models'
import {format} from 'date-fns'
import {dateLocale} from '../../constants/languages'

export class DateAxis {
  private dates: DateEntry[]

  private constructor(dates: DateEntry[]) {
    this.dates = dates
  }

  public static CreateMostRecentMonthsFromBloodSugars(
    bloodSugars: BloodSugar[],
    monthRange: number,
  ): DateAxis {
    const lastDateValue = bloodSugars.reduce(
      (memo: Date | null, current: BloodSugar): Date => {
        const currentDate = new Date(current.recorded_at)
        return memo == null || currentDate > memo ? currentDate : memo
      },
      null,
    )

    if (lastDateValue == null) {
      throw new Error('Can not find last date')
    }

    const endDate = addDays(
      new Date(
        Date.UTC(
          lastDateValue.getUTCFullYear(),
          lastDateValue.getUTCMonth() + 1,
          1,
        ),
      ),
      -1,
    )
    const startDate = new Date(
      Date.UTC(
        endDate.getUTCFullYear(),
        endDate.getUTCMonth() - (monthRange - 1),
        1,
      ),
    )

    const numberOfDays = differenceInDays(endDate, startDate) + 1

    const dates = [...Array(numberOfDays)].map((_, index) => {
      return new DateEntry(addDays(startDate, index), index)
    })

    return new DateAxis(dates)
  }

  public getDateEntryForBloodSugar(
    bloodSugar: BloodSugar,
  ): DateEntry | undefined {
    const dateToFind = new Date(bloodSugar.recorded_at)

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

  public getAxisTickValues(): {
    month: number
    monthName: string
    year: number
  }[] {
    const values: {month: number; monthName: string; year: number}[] = []
    this.dates.forEach((date) => {
      if (
        !values.find((value) => {
          return (
            value.month === date.getDate().getMonth() &&
            value.year === date.getDate().getFullYear()
          )
        })
      ) {
        values.push({
          month: date.getDate().getMonth(),
          monthName: format(date.getDate(), 'MMM', {
            locale: dateLocale(),
          }),
          year: date.getDate().getFullYear(),
        })
      }
    })
    return values
  }
}
