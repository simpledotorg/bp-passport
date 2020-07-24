import {BLOOD_SUGAR_TYPES} from '../../redux/blood-sugar/blood-sugar.models'
import {IDefineAChartRequest} from './i-define-a-chart-request'
import {RequestSingleMonthChart} from './request-single-month-chart'
import {IDefineChartsAvailable} from './i-define-charts-available'
import {getYearTitle} from '../../utils/dates'
import {BloodSugarCode} from '../../utils/blood-sugars'
import ConvertedBloodSugarReading from '../../models/converted_blood_sugar_reading'

export class RequestHemoglobicChart
  implements IDefineAChartRequest, IDefineChartsAvailable {
  private readonly _yearToDisplay: number
  private readonly _chartTitle: string

  private readonly _readings: ConvertedBloodSugarReading[]
  private readonly hasRandomReadings: boolean
  private readonly hasPostPrandialReadings: boolean
  private readonly hasFastingReadings: boolean
  private readonly hasHemoglobicReadings: boolean
  private readonly hasBeforeEatingReadings: boolean
  private readonly hasAfterEatingReadings: boolean

  private constructor(
    yearToDisplay: number,
    readings: ConvertedBloodSugarReading[],
  ) {
    this._chartTitle = getYearTitle(yearToDisplay)

    this._yearToDisplay = yearToDisplay
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
    this.hasBeforeEatingReadings = readings.hasReadingType(
      BLOOD_SUGAR_TYPES.BEFORE_EATING,
    )
    this.hasAfterEatingReadings = readings.hasReadingType(
      BLOOD_SUGAR_TYPES.AFTER_EATING,
    )
  }

  public static StartingState(
    readings: ConvertedBloodSugarReading[],
  ): RequestHemoglobicChart {
    const mostRecentReading = readings
      .filter((reading) => {
        return reading.blood_sugar_type === BLOOD_SUGAR_TYPES.HEMOGLOBIC
      })
      .reduce(
        (memo: Date | null, current: ConvertedBloodSugarReading): Date => {
          const currentDate = new Date(current.recorded_at)
          return memo == null || currentDate > memo ? currentDate : memo
        },
        null,
      )

    return new RequestHemoglobicChart(
      mostRecentReading?.getFullYear() ?? new Date().getFullYear(),
      readings,
    )
  }

  public changeRequestedType(
    requestedType: BLOOD_SUGAR_TYPES,
    readings: ConvertedBloodSugarReading[],
    displayUnits: BloodSugarCode,
  ): IDefineAChartRequest {
    if (requestedType === BLOOD_SUGAR_TYPES.HEMOGLOBIC) {
      return new RequestHemoglobicChart(this._yearToDisplay, this._readings)
    }

    return RequestSingleMonthChart.ForRequestedType(
      requestedType,
      readings,
      displayUnits,
    )
  }

  public withUpdatedReadings(
    readings: ConvertedBloodSugarReading[],
  ): IDefineAChartRequest {
    return new RequestHemoglobicChart(this._yearToDisplay, readings)
  }

  public moveToNextPeriod(): RequestHemoglobicChart {
    return new RequestHemoglobicChart(this._yearToDisplay + 1, this._readings)
  }

  public moveToPreviousPeriod(): RequestHemoglobicChart {
    return new RequestHemoglobicChart(this._yearToDisplay - 1, this._readings)
  }

  public get chartType(): BLOOD_SUGAR_TYPES {
    return BLOOD_SUGAR_TYPES.HEMOGLOBIC
  }

  public get yearToDisplay(): number {
    return this._yearToDisplay
  }

  public get readings(): ConvertedBloodSugarReading[] {
    return this._readings
  }

  public getTitle(): string {
    return this._chartTitle
  }

  public getChartType(): BLOOD_SUGAR_TYPES {
    return BLOOD_SUGAR_TYPES.HEMOGLOBIC
  }

  public getDisplayUnits(): BloodSugarCode {
    return BloodSugarCode.PERCENT
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
