import {BloodPressure} from '../../redux/blood-pressure/blood-pressure.models'

export class ChartRequest {
  private readonly _requestedMonth: number
  private readonly _requestedYear: number

  private constructor(requestedMonth?: number, requestedYear?: number) {
    if (requestedMonth === undefined) {
      this._requestedMonth = new Date().getMonth()
    } else {
      this._requestedMonth = requestedMonth
    }

    if (requestedYear === undefined) {
      this._requestedYear = new Date().getFullYear()
    } else {
      this._requestedYear = requestedYear
    }
  }

  public static CreateFromAvailableReadings(
    readings: BloodPressure[],
  ): ChartRequest {
    const mostRecentReading = readings.mostRecent()

    const date = mostRecentReading
      ? new Date(mostRecentReading.recorded_at)
      : undefined

    return new ChartRequest(date?.getMonth(), date?.getFullYear())
  }

  public getTitle(): string {
    return '-'
  }

  public get requestedMonth(): number {
    return this._requestedMonth
  }

  public get requestedYear(): number {
    return this._requestedYear
  }

  public moveToNextPeriod(): ChartRequest {
    let newMonth = this._requestedMonth + 1
    let newYear = this._requestedYear
    if (newMonth > 12) {
      newMonth = 1
      newYear++
    }

    return new ChartRequest(newMonth, newYear)
  }

  public moveToPreviousPeriod(): ChartRequest {
    let newMonth = this._requestedMonth - 1
    let newYear = this._requestedYear
    if (newMonth <= 0) {
      newMonth = 12
      newYear--
    }

    return new ChartRequest(newMonth, newYear)
  }
}
