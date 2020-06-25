import {BloodPressure} from '../../redux/blood-pressure/blood-pressure.models'
import {useIntl} from 'react-intl'
import {format} from 'date-fns'

export class ScatterGraphDataPoint {
  private intl = useIntl()

  public x: number
  public y: number
  public label: string
  public showOutOfRange: boolean

  constructor(index: number, reading: BloodPressure) {
    this.x = index
    this.y = Number(reading.diastolic)
    this.label = `${reading.systolic.toFixed(0)} / ${reading.diastolic.toFixed(
      0,
    )}, ${format(new Date(reading.recorded_at), 'dd-MMM-yyyy')}`
  }
}
