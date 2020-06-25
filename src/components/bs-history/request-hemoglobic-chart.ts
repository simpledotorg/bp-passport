import {
  BloodSugar,
  BLOOD_SUGAR_TYPES,
} from '../../redux/blood-sugar/blood-sugar.models'
import {IDefineAChartRequest} from './i-define-a-chart-request'
import {RequestSingleMonthChart} from './request-single-month-chart'
import {IDefineChartsAvailable} from './i-define-charts-available'

export class RequestHemoglobicChart
  implements IDefineAChartRequest, IDefineChartsAvailable {
  private readonly _yearToDisplay: number

  private readonly _readings: BloodSugar[]
  private readonly hasRandomReadings: boolean
  private readonly hasPostPrandialReadings: boolean
  private readonly hasFastingReadings: boolean
  private readonly hasHemoglobicReadings: boolean

  private constructor(yearToDisplay: number, readings: BloodSugar[]) {
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
  }

  public static StartingState(readings: BloodSugar[]): RequestHemoglobicChart {
    const mostRecentReading = readings
      .filter((reading) => {
        return reading.blood_sugar_type === BLOOD_SUGAR_TYPES.HEMOGLOBIC
      })
      .reduce((memo: Date | null, current: BloodSugar): Date => {
        const currentDate = new Date(current.recorded_at)
        return memo == null || currentDate > memo ? currentDate : memo
      }, null)

    return new RequestHemoglobicChart(
      mostRecentReading?.getFullYear() ?? new Date().getFullYear(),
      readings,
    )
  }

  public changeRequestedType(
    requestedType: BLOOD_SUGAR_TYPES,
    readings: BloodSugar[],
  ): IDefineAChartRequest {
    if (requestedType === BLOOD_SUGAR_TYPES.HEMOGLOBIC) {
      return new RequestHemoglobicChart(this._yearToDisplay, this._readings)
    }

    return RequestSingleMonthChart.ForRequestedType(requestedType, readings)
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

  public getChartType(): BLOOD_SUGAR_TYPES {
    return BLOOD_SUGAR_TYPES.HEMOGLOBIC
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
