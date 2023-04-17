import { BLOOD_SUGAR_TYPES } from '../../redux/blood-sugar/blood-sugar.models'
import { IDefineAChartRequest } from './i-define-a-chart-request'
import { RequestHemoglobicChart } from './request-hemoglobic-chart'
import { IDefineChartsAvailable } from './i-define-charts-available'
import { dateLocale } from '../../constants/languages'
import { format } from 'date-fns'
import {
  BloodSugarCode,
  filterByTypes,
  filterByType,
  filterForMonthAndYear,
  mostRecent,
  hasReadingType,
} from '../../utils/blood-sugars'
import ConvertedBloodSugarReading from '../../models/converted_blood_sugar_reading'

export class RequestSingleMonthChart
  implements IDefineAChartRequest, IDefineChartsAvailable
{
  private readonly _chartType: BLOOD_SUGAR_TYPES
  private readonly _chartTitle: string
  private readonly _displayUnits: BloodSugarCode

  private readonly _requestedMonth: number
  private readonly _requestedYear: number

  private readonly _readings: ConvertedBloodSugarReading[]
  private readonly hasRandomReadings: boolean
  private readonly hasPostPrandialReadings: boolean
  private readonly hasFastingReadings: boolean
  private readonly hasHemoglobicReadings: boolean
  private readonly hasBeforeEatingReadings: boolean
  private readonly hasAfterEatingReadings: boolean

  private constructor(
    chartType: BLOOD_SUGAR_TYPES,
    readings: ConvertedBloodSugarReading[],
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

    this.hasRandomReadings = hasReadingType(
      readings,
      BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR,
    )
    this.hasPostPrandialReadings = hasReadingType(
      readings,
      BLOOD_SUGAR_TYPES.POST_PRANDIAL,
    )
    this.hasFastingReadings = hasReadingType(
      readings,
      BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR,
    )
    this.hasHemoglobicReadings = hasReadingType(
      readings,
      BLOOD_SUGAR_TYPES.HEMOGLOBIC,
    )
    this.hasBeforeEatingReadings = hasReadingType(
      readings,
      BLOOD_SUGAR_TYPES.BEFORE_EATING,
    )
    this.hasAfterEatingReadings = hasReadingType(
      readings,
      BLOOD_SUGAR_TYPES.AFTER_EATING,
    )
  }

  private static getFilterTypes = (chartType: BLOOD_SUGAR_TYPES) => {
    switch (chartType) {
      case BLOOD_SUGAR_TYPES.BEFORE_EATING:
      case BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR:
        return [
          BLOOD_SUGAR_TYPES.BEFORE_EATING,
          BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR,
        ]
      case BLOOD_SUGAR_TYPES.AFTER_EATING:
      case BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR:
      case BLOOD_SUGAR_TYPES.POST_PRANDIAL:
        return [
          BLOOD_SUGAR_TYPES.AFTER_EATING,
          BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR,
          BLOOD_SUGAR_TYPES.POST_PRANDIAL,
        ]

      default:
        throw new Error('Requested blood sugar type not handled')
    }
  }

  private static populateChartTitle(
    chartType: BLOOD_SUGAR_TYPES,
    readings: ConvertedBloodSugarReading[],
    requestedMonth?: number,
    requestedYear?: number,
  ): string {
    if (requestedMonth && requestedYear) {
      const date = new Date(requestedYear, requestedMonth, 1)
      return RequestSingleMonthChart.formatDateToTitle(date)
    }

    if (requestedMonth === undefined) {
      const filteredByTypes = filterByTypes(
        readings,
        RequestSingleMonthChart.getFilterTypes(chartType),
      )

      const mostRecentReading = mostRecent(filteredByTypes)

      if (mostRecentReading === null) {
        return '-'
      }

      return RequestSingleMonthChart.formatDateToTitle(
        new Date(mostRecentReading.recorded_at),
      )
    }

    const filteredByType = filterByType(readings, chartType)
    const filteredByMonthAndYear = filterForMonthAndYear(
      filteredByType,
      requestedMonth,
      requestedYear ?? new Date().getFullYear(),
    )
    const bloodSugar = mostRecent(filteredByMonthAndYear)

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

  public static ForRequestedType(
    chartType: BLOOD_SUGAR_TYPES,
    readings: ConvertedBloodSugarReading[],
    displayUnits: BloodSugarCode,
  ): RequestSingleMonthChart {
    const filteredByTypes = filterByTypes(
      readings,
      RequestSingleMonthChart.getFilterTypes(chartType),
    )

    const mostRecentReading = mostRecent(filteredByTypes)

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

  public get readings(): ConvertedBloodSugarReading[] {
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
    readings: ConvertedBloodSugarReading[],
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

  public withUpdatedReadings(
    readings: ConvertedBloodSugarReading[],
  ): IDefineAChartRequest {
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

  public getHasBeforeEatingReadings(): boolean {
    return this.hasBeforeEatingReadings
  }

  public getHasAfterEatingReadings(): boolean {
    return this.hasAfterEatingReadings
  }
}
