import {BloodSugar} from '../../redux/blood-sugar/blood-sugar.models'

export class LineGraphDataPoint {
  public x: number
  public y: number | null

  public constructor(index: number, reading: BloodSugar) {
    this.x = index
    this.y = Number(reading.blood_sugar_value)
  }
}
