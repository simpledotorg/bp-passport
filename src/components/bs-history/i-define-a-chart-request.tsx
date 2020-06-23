import {BLOOD_SUGAR_TYPES} from '../../redux/blood-sugar/blood-sugar.models'

export interface IDefineAChartRequest {
  readonly chartType: BLOOD_SUGAR_TYPES
}
