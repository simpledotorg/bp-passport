import {
  BloodSugar,
  BLOOD_SUGAR_TYPES,
} from '../../redux/blood-sugar/blood-sugar.models'
import {IDefineChartsAvailable} from './i-define-charts-available'
import {RequestSingleMonthChart} from './request-single-month-chart'
import {RequestHemoglobicChart} from './request-hemoglobic-chart'

export interface IDefineAChartRequest extends IDefineChartsAvailable {
  readonly chartType: BLOOD_SUGAR_TYPES
  changeRequestedType(
    requestedType: BLOOD_SUGAR_TYPES,
    readings: BloodSugar[],
  ): IDefineAChartRequest

  withUpdatedReadings(readings: BloodSugar[]): IDefineAChartRequest

  moveToNextPeriod(): IDefineAChartRequest

  moveToPreviousPeriod(): IDefineAChartRequest

  readonly readings: BloodSugar[]
}

export const getStartingChartRequest = (
  readings: BloodSugar[],
): IDefineAChartRequest => {
  if (
    readings.hasReadingType(BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR) ||
    readings.hasReadingType(BLOOD_SUGAR_TYPES.POST_PRANDIAL) ||
    readings.hasReadingType(BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR)
  ) {
    return RequestSingleMonthChart.DefaultTypeFromAvailableReadings(readings)
  }

  if (readings.hasReadingType(BLOOD_SUGAR_TYPES.HEMOGLOBIC)) {
    return RequestHemoglobicChart.StartingState(readings)
  }

  throw new Error('Unhandled blood sugar type')
}
