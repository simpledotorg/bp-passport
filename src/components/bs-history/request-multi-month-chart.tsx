import {
  BloodSugar,
  BLOOD_SUGAR_TYPES,
} from '../../redux/blood-sugar/blood-sugar.models'
import {IDefineAChartRequest} from './i-define-a-chart-request'
import {CHART_MONTH_RANGE} from '../../utils/dates'

export class RequestMultiMonthChart implements IDefineAChartRequest {
  private readonly _chartType: BLOOD_SUGAR_TYPES
  private readonly _numberOfMonths: number

  private constructor(
    chartType: BLOOD_SUGAR_TYPES,
    numberOfMonths: number = CHART_MONTH_RANGE,
  ) {
    this._chartType = chartType
    this._numberOfMonths = numberOfMonths
  }

  public static DefaultTypeFromAvailableReadings(
    readings: BloodSugar[],
    numberOfMonths?: number,
  ): RequestMultiMonthChart {
    return new RequestMultiMonthChart(
      BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR,
      numberOfMonths,
    )
  }

  public static FromUserSelected(
    chartType: BLOOD_SUGAR_TYPES,
    numberOfMonths?: number,
  ): RequestMultiMonthChart {
    return new RequestMultiMonthChart(chartType, numberOfMonths)
  }

  public changeRequestedType(
    requestedType: BLOOD_SUGAR_TYPES,
  ): IDefineAChartRequest {
    return RequestMultiMonthChart.FromUserSelected(
      requestedType,
      this._numberOfMonths,
    )
  }

  public get chartType(): BLOOD_SUGAR_TYPES {
    return this._chartType
  }

  public get numberOfMonths(): number {
    return this._numberOfMonths
  }
}
