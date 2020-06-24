import {
  BloodSugar,
  BLOOD_SUGAR_TYPES,
} from '../../redux/blood-sugar/blood-sugar.models'

export interface IDefineAChartRequest {
  readonly chartType: BLOOD_SUGAR_TYPES
  changeRequestedType(
    requestedType: BLOOD_SUGAR_TYPES,
    readings: BloodSugar[],
  ): IDefineAChartRequest
}
