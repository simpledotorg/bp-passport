import {
  BloodSugar,
  BLOOD_SUGAR_TYPES,
} from '../../redux/blood-sugar/blood-sugar.models'
import {IDefineAChartRequest} from './i-define-a-chart-request'
import {RequestHemoglobicChart} from './request-hemoglobic-chart'
import {IDefineChartsAvailable} from './i-define-charts-available'
import {dateLocale} from '../../constants/languages'
import {format} from 'date-fns'
import {BloodSugarCode} from '../../utils/blood-sugars'

export class RequestSingleMonthChart
  implements IDefineAChartRequest, IDefineChartsAvailable {
  private readonly _chartType: BLOOD_SUGAR_TYPES
  private readonly _chartTitle: string
  private readonly _displayUnits: BloodSugarCode

  private readonly _requestedMonth: number
  private readonly _requestedYear: number

  private readonly _readings: BloodSugar[]
  private readonly hasRandomReadings: boolean
  private readonly hasPostPrandialReadings: boolean
  private readonly hasFastingReadings: boolean
  private readonly hasHemoglobicReadings: boolean

  private constructor(
    chartType: BLOOD_SUGAR_TYPES,
    readings: BloodSugar[],
    displayUnits: BloodSugarCode,
    requestedMonth?: number,
    requestedYear?: number,
  ) {
    this._chartType = chartType
    this._chartTitle = RequestSingleMonthChart.populateChartTitle(
      chartType,
      readings,
      requestedMonth,
      requestedYear,
    )

    this._displayUnits = displayUnits

    this._requestedMonth = requestedMonth ?? new Date().getMonth()
    this._requestedYear = requestedYear ?? new Date().getFullYear()
    this._readings = readings

    this.hasRandomReadings = readings.hasReadingType(
      BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR,
    )
    this.hasPostPrandialReadings = readings.hasReadingType(
      BLOOD_SUGAR_TYPES.POST_PRANDIAL,
    )
    this.hasFastingReadings = readings.hasReadingType(
      BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR,
    )
    this.hasHemoglobicReadings = readings.hasReadingType(
      BLOOD_SUGAR_TYPES.HEMOGLOBIC,
    )
  }

  private static populateChartTitle(
    chartType: BLOOD_SUGAR_TYPES,
    readings: BloodSugar[],
    requestedMonth?: number,
    requestedYear?: number,
  ): string {
    if (requestedMonth && requestedYear) {
      const date = new Date(requestedYear, requestedMonth, 1)
      return RequestSingleMonthChart.formatDateToTitle(date)
    }

    if (requestedMonth === undefined) {
      const mostRecent = readings.filterByType(chartType).mostRecent()
      if (mostRecent === null) {
        return '-'
      }

      return RequestSingleMonthChart.formatDateToTitle(
        new Date(mostRecent.recorded_at),
      )
    }

    const bloodSugar = readings
      .filterByType(chartType)
      .filterForMonthAndYear(
        requestedMonth,
        requestedYear ?? new Date().getFullYear(),
      )
      .mostRecent()
    if (bloodSugar === null) {
      return '-'
    }

    return RequestSingleMonthChart.formatDateToTitle(
      new Date(bloodSugar.recorded_at),
    )
  }

  private static formatDateToTitle(date: Date): string {
    return format(date, 'MMM-yyyy', {
      locale: dateLocale(),
    })
  }

  public static DefaultTypeFromAvailableReadings(
    readings: BloodSugar[],
    displayUnits: BloodSugarCode,
  ): RequestSingleMonthChart {
    return RequestSingleMonthChart.ForRequestedType(
      BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR,
      readings,
      displayUnits,
    )
  }

  public static ForRequestedType(
    chartType: BLOOD_SUGAR_TYPES,
    readings: BloodSugar[],
    displayUnits: BloodSugarCode,
  ): RequestSingleMonthChart {
    const mostRecentReading = readings.filterByType(chartType).mostRecent()

    const date = mostRecentReading
      ? new Date(mostRecentReading.recorded_at)
      : undefined

    return new RequestSingleMonthChart(
      chartType,
      readings,
      displayUnits,
      date ? date.getMonth() : undefined,
      date?.getFullYear(),
    )
  }

  public get chartType(): BLOOD_SUGAR_TYPES {
    return this._chartType
  }

  public getDisplayUnits(): BloodSugarCode {
    return this._displayUnits
  }

  public get requestedMonth(): number {
    return this._requestedMonth
  }

  public get requestedYear(): number {
    return this._requestedYear
  }

  public get readings(): BloodSugar[] {
    return this._readings
  }

  public moveToNextPeriod(): RequestSingleMonthChart {
    let newMonth = this._requestedMonth + 1
    let newYear = this._requestedYear
    if (newMonth > 12) {
      newMonth = 1
      newYear++
    }

    return new RequestSingleMonthChart(
      this._chartType,
      this._readings,
      this._displayUnits,
      newMonth,
      newYear,
    )
  }

  public moveToPreviousPeriod(): RequestSingleMonthChart {
    let newMonth = this._requestedMonth - 1
    let newYear = this._requestedYear
    if (newMonth <= 0) {
      newMonth = 12
      newYear--
    }

    return new RequestSingleMonthChart(
      this._chartType,
      this._readings,
      this._displayUnits,
      newMonth,
      newYear,
    )
  }

  public changeRequestedType(
    requestedType: BLOOD_SUGAR_TYPES,
    readings: BloodSugar[],
    displayUnits: BloodSugarCode,
  ): IDefineAChartRequest {
    if (requestedType === BLOOD_SUGAR_TYPES.HEMOGLOBIC) {
      return RequestHemoglobicChart.StartingState(readings)
    }

    return new RequestSingleMonthChart(
      requestedType,
      readings,
      displayUnits,
      this._requestedMonth,
      this._requestedYear,
    )
  }

  public withUpdatedReadings(readings: BloodSugar[]): IDefineAChartRequest {
    return new RequestSingleMonthChart(
      this._chartType,
      readings,
      this._displayUnits,
      this._requestedMonth,
      this._requestedYear,
    )
  }

  public getTitle(): string {
    return this._chartTitle
  }

  public getChartType(): BLOOD_SUGAR_TYPES {
    return this._chartType
  }

  public getHasRandomReadings(): boolean {
    return this.hasRandomReadings
  }

  public getHasPostPrandialReadings(): boolean {
    return this.hasPostPrandialReadings
  }

  public getHasFastingReadings(): boolean {
    return this.hasFastingReadings
  }

  public getHasHemoglobicReadings(): boolean {
    return this.hasHemoglobicReadings
  }
}
