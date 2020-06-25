import {
  BloodSugar,
  BLOOD_SUGAR_TYPES,
} from '../../redux/blood-sugar/blood-sugar.models'
import {IDefineAChartRequest} from './i-define-a-chart-request'
import {RequestHemoglobicChart} from './request-hemoglobic-chart'
import {read} from 'fs'

export class RequestSingleMonthChart implements IDefineAChartRequest {
  private readonly _chartType: BLOOD_SUGAR_TYPES
  private readonly _requestedMonth: number
  private readonly _requestedYear: number

  private constructor(
    chartType: BLOOD_SUGAR_TYPES,
    requestedMonth?: number,
    requestedYear?: number,
  ) {
    this._chartType = chartType
    if (requestedMonth === undefined) {
      this._requestedMonth = new Date().getMonth() + 1
    } else {
      this._requestedMonth = requestedMonth
    }

    if (requestedYear === undefined) {
      this._requestedYear = new Date().getFullYear()
    } else {
      this._requestedYear = requestedYear
    }
  }

  public static DefaultTypeFromAvailableReadings(
    readings: BloodSugar[],
  ): RequestSingleMonthChart {
    return RequestSingleMonthChart.ForRequestedType(
      BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR,
      readings,
    )
  }

  public static ForRequestedType(
    chartType: BLOOD_SUGAR_TYPES,
    readings: BloodSugar[],
  ): RequestSingleMonthChart {
    const mostRecentReading = readings.filterByType(chartType).mostRecent()

    const date = mostRecentReading
      ? new Date(mostRecentReading.recorded_at)
      : undefined

    return new RequestSingleMonthChart(
      chartType,
      date ? date.getMonth() + 1 : undefined,
      date?.getFullYear(),
    )
  }

  public get chartType(): BLOOD_SUGAR_TYPES {
    return this._chartType
  }

  public get requestedMonth(): number {
    return this._requestedMonth
  }

  public get requestedYear(): number {
    return this._requestedYear
  }

  public moveToNextPeriod(): RequestSingleMonthChart {
    let newMonth = this._requestedMonth + 1
    let newYear = this._requestedYear
    if (newMonth > 12) {
      newMonth = 1
      newYear++
    }

    return new RequestSingleMonthChart(this._chartType, newMonth, newYear)
  }

  public moveToPreviousPeriod(): RequestSingleMonthChart {
    let newMonth = this._requestedMonth - 1
    let newYear = this._requestedYear
    if (newMonth <= 0) {
      newMonth = 12
      newYear--
    }

    return new RequestSingleMonthChart(this._chartType, newMonth, newYear)
  }

  public changeRequestedType(
    requestedType: BLOOD_SUGAR_TYPES,
    readings: BloodSugar[],
  ): IDefineAChartRequest {
    if (requestedType === BLOOD_SUGAR_TYPES.HEMOGLOBIC) {
      return RequestHemoglobicChart.StartingState(readings)
    }

    return new RequestSingleMonthChart(
      requestedType,
      this._requestedMonth,
      this._requestedYear,
    )
  }
}
