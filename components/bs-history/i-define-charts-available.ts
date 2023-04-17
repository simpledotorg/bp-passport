import { BLOOD_SUGAR_TYPES } from '../../redux/blood-sugar/blood-sugar.models'
import { BloodSugarCode } from '../../utils/blood-sugars'

export interface IDefineChartsAvailable {
  getChartType(): BLOOD_SUGAR_TYPES

  getTitle(): string

  getHasRandomReadings(): boolean

  getHasPostPrandialReadings(): boolean

  getHasFastingReadings(): boolean

  getHasHemoglobicReadings(): boolean

  getHasBeforeEatingReadings(): boolean

  getHasAfterEatingReadings(): boolean

  getDisplayUnits(): BloodSugarCode
}
