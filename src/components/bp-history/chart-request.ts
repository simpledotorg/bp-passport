import {BloodPressure} from '../../redux/blood-pressure/blood-pressure.models'
import {ChartData} from './chart-data'

export class ChartRequest {
  private _readings: BloodPressure[]

  private readonly _requestedMonth: number
  private readonly _requestedYear: number

  private constructor(
    readings: BloodPressure[],
    requestedMonth?: number,
    requestedYear?: number,
  ) {
    this._readings = readings

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

    return new ChartRequest(readings, date?.getMonth(), date?.getFullYear())
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

  public get readings(): BloodPressure[] {
    return this._readings
  }

  public moveToNextPeriod(): ChartRequest {
    let newMonth = this._requestedMonth + 1
    let newYear = this._requestedYear
    if (newMonth > 12) {
      newMonth = 1
      newYear++
    }

    return new ChartRequest(this._readings, newMonth, newYear)
  }

  public moveToPreviousPeriod(): ChartRequest {
    let newMonth = this._requestedMonth - 1
    let newYear = this._requestedYear
    if (newMonth <= 0) {
      newMonth = 12
      newYear--
    }

    return new ChartRequest(this._readings, newMonth, newYear)
  }

  public withUpdatedReadings(readings: BloodPressure[]): ChartRequest {
    return new ChartRequest(readings, this._requestedMonth, this._requestedYear)
  }

  public createChartData(): ChartData {
    return new ChartData(this)
  }
}
