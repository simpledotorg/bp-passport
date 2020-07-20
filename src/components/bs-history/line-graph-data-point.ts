import ConvertedBloodSugarReading from '../../models/converted_blood_sugar_reading'

export class LineGraphDataPoint {
  public x: number
  public y: number | null

  public constructor(index: number, reading: ConvertedBloodSugarReading) {
    this.x = index
    this.y = reading.value
  }
}
