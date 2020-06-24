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
    return new RequestHemoglobicChart(2020)
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
}
