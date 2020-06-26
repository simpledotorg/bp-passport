import {BloodPressure} from '../../redux/blood-pressure/blood-pressure.models'

export interface IDefineAChartRequest {
  changeRequestedType(readings: BloodPressure[]): IDefineAChartRequest

  getTitle(): string

  moveToNextPeriod(): IDefineAChartRequest

  moveToPreviousPeriod(): IDefineAChartRequest
}
