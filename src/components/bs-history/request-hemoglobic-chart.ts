import {
  BloodSugar,
  BLOOD_SUGAR_TYPES,
} from '../../redux/blood-sugar/blood-sugar.models'
import {IDefineAChartRequest} from './i-define-a-chart-request'
import {RequestSingleMonthChart} from './request-single-month-chart'

export class RequestHemoglobicChart implements IDefineAChartRequest {
  private readonly _yearToDisplay: number

  private constructor(yearToDisplay: number) {
    this._yearToDisplay = yearToDisplay
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
    )
  }

  public changeRequestedType(
    requestedType: BLOOD_SUGAR_TYPES,
    readings: BloodSugar[],
  ): IDefineAChartRequest {
    if (requestedType === BLOOD_SUGAR_TYPES.HEMOGLOBIC) {
      return this
    }

    return RequestSingleMonthChart.ForRequestedType(requestedType, readings)
  }

  public get chartType(): BLOOD_SUGAR_TYPES {
    return BLOOD_SUGAR_TYPES.HEMOGLOBIC
  }

  public get yearToDisplay(): number {
    return this._yearToDisplay
  }
}
