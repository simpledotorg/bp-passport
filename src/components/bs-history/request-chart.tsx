import {
  BloodSugar,
  BLOOD_SUGAR_TYPES,
} from '../../redux/blood-sugar/blood-sugar.models'

export class RequestChart {
  private readonly chartType: BLOOD_SUGAR_TYPES

  private constructor(chartType: BLOOD_SUGAR_TYPES) {
    this.chartType = chartType
  }

  public static DefaultTypeFromAvailableReadings(
    readings: BloodSugar[],
  ): RequestChart {
    return new RequestChart(BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR)
  }

  public static FromUserSelected(chartType: BLOOD_SUGAR_TYPES): RequestChart {
    return new RequestChart(chartType)
  }

  public getChartType(): BLOOD_SUGAR_TYPES {
    return this.chartType
  }
}
