import {
  BloodSugar,
  BLOOD_SUGAR_TYPES,
} from '../../redux/blood-sugar/blood-sugar.models'
import {isHighBloodSugar, isLowBloodSugar} from '../../utils/blood-sugars'
import {useIntl} from 'react-intl'
import {format} from 'date-fns'

export class ScatterGraphDataPoint {
  private intl = useIntl()

  public x: number
  public y: number
  public label: string
  public showOutOfRange: boolean

  constructor(index: number, reading: BloodSugar) {
    this.x = index
    this.y = Number(reading.blood_sugar_value)
    this.label = `${this.y.toFixed(0)}${
      ScatterGraphDataPoint.showMGDL(reading)
        ? this.intl.formatMessage({
            id: 'bs.mgdl',
          })
        : '%,'
    } ${this.getBloodSugarType(reading)}${format(
      new Date(reading.recorded_at),
      'dd-MMM-yyyy',
    )}`

    this.showOutOfRange = isHighBloodSugar(reading) || isLowBloodSugar(reading)
  }

  private static showMGDL(reading: BloodSugar): boolean {
    return (
      reading.blood_sugar_type === BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR ||
      reading.blood_sugar_type === BLOOD_SUGAR_TYPES.POST_PRANDIAL ||
      reading.blood_sugar_type === BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR
    )
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
