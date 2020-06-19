import {BloodSugar} from '../../redux/blood-sugar/blood-sugar.models'
import {isHighBloodSugar, isLowBloodSugar} from '../../utils/blood-sugars'
export class ScatterGraphDataPoint {
  public x: number
  public y: number
  public label: string
  public showOutOfRange: boolean

  constructor(index: number, reading: BloodSugar) {
    this.x = index
    this.y = Number(reading.blood_sugar_value)
    this.label = reading.blood_sugar_value
    this.showOutOfRange = isHighBloodSugar(reading) || isLowBloodSugar(reading)
  }
}
