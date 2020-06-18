import {DateEntry} from './date-entry'
import {BloodSugar} from '../../redux/blood-sugar/blood-sugar.models'

export class AggregatedBloodSugarData {
  private dateEntry: DateEntry

  private minReading: number | null = null
  private maxReading: number | null = null

  private readings: number[] = []

  public constructor(dateEntry: DateEntry) {
    this.dateEntry = dateEntry
  }

  public getDateEntry(): DateEntry {
    return this.dateEntry
  }

  private updateMinReading(readingValue: number): void {
    if (!this.minReading || this.minReading > readingValue) {
      this.minReading = readingValue
    }
  }

  private updateMaxReading(readingValue: number): void {
    if (!this.maxReading || readingValue > this.maxReading) {
      this.maxReading = readingValue
    }
  }

  public addReading(reading: BloodSugar): void {
    const readingValue = Number(reading.blood_sugar_value)
    this.readings.push(readingValue)
    this.updateMinReading(readingValue)
    this.updateMaxReading(readingValue)
  }

  public getReadings(): number[] {
    return this.readings
  }

  public getMaxReading(): number | null {
    return this.maxReading
  }

  public getMinReading(): number | null {
    return this.minReading
  }
}
