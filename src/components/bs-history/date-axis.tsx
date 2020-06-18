import {differenceInDays, addMonths, addDays} from 'date-fns'
import {DateEntry} from './date-entry'
import {BloodSugar} from '../../redux/blood-sugar/blood-sugar.models'

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

    const endDate = new Date(
      Date.UTC(
        lastDateValue.getUTCFullYear(),
        lastDateValue.getUTCMonth(),
        lastDateValue.getUTCDate(),
      ),
    )
    const startDate = addMonths(endDate, monthRange * -1)

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

    //console.log(dateToFind)
    //console.log(this.dates)
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
}
