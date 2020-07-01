import {
  BloodSugar,
  BLOOD_SUGAR_TYPES,
} from '../../redux/blood-sugar/blood-sugar.models'
import {
  isHighBloodSugar,
  isLowBloodSugar,
  BloodSugarCode,
  determinePrecision,
} from '../../utils/blood-sugars'
import {useIntl} from 'react-intl'
import {format} from 'date-fns'
import ConvertedBloodSugarReading from '../../models/converted_blood_sugar_reading'

export class ScatterGraphDataPoint {
  private intl = useIntl()

  public x: number
  public y: number
  public label: string
  public showOutOfRange: boolean

  constructor(index: number, reading: ConvertedBloodSugarReading) {
    const precision = !reading.blood_sugar_unit
      ? 0
      : determinePrecision(reading.blood_sugar_unit)

    this.x = index
    this.y = Number(Number(reading.blood_sugar_value).toFixed(precision))

    this.label =
      `${this.y.toFixed(precision)}${this.getDisplayUnits(
        reading,
      )} ${this.getBloodSugarType(reading)}${format(
        new Date(reading.recorded_at),
        'dd',
      )}-` +
      `${
        this.intl.formatMessage({
          id: `general.${format(
            new Date(reading.recorded_at),
            'MMM',
          ).toLowerCase()}`,
        }) + `-${format(new Date(reading.recorded_at), 'yyyy')}`
      }`

    this.showOutOfRange =
      isHighBloodSugar(reading, reading) || isLowBloodSugar(reading)
  }

  private getDisplayUnits(reading: BloodSugar): string {
    switch (reading.blood_sugar_unit) {
      case BloodSugarCode.PERCENT:
        return '%'
      case BloodSugarCode.MMOL_L:
        return this.intl.formatMessage({id: 'bs.mmoll'})
      default:
        return this.intl.formatMessage({
          id: 'bs.mgdl',
        })
    }
  }

  private getBloodSugarType(reading: BloodSugar): string {
    if (reading.blood_sugar_type === BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR) {
      return (
        this.intl.formatMessage({
          id: 'bs.random-blood-code',
        }) + ', '
      )
    }

    if (reading.blood_sugar_type === BLOOD_SUGAR_TYPES.POST_PRANDIAL) {
      return (
        this.intl.formatMessage({
          id: 'bs.post-prenial-code',
        }) + ', '
      )
    }

    if (reading.blood_sugar_type === BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR) {
      return (
        this.intl.formatMessage({
          id: 'bs.fasting-code',
        }) + ', '
      )
    }

    return ''
  }
}
