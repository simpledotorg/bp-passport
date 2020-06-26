import {
  BloodSugar,
  BLOOD_SUGAR_TYPES,
} from '../../redux/blood-sugar/blood-sugar.models'
import {IDefineChartsAvailable} from './i-define-charts-available'

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
