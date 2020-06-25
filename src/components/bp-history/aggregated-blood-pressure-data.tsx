import {DateEntry} from './date-entry'
import {BloodPressure} from '../../redux/blood-pressure/blood-pressure.models'

export class AggregatedBloodPressureData {
  private dateEntry: DateEntry

  private minReading: BloodPressure | null = null
  private maxReading: BloodPressure | null = null

  private readings: BloodPressure[] = []

  public constructor(dateEntry: DateEntry) {
    this.dateEntry = dateEntry
  }

  public getDateEntry(): DateEntry {
    return this.dateEntry
  }

  private updateMinReading(reading: BloodPressure): void {
    if (!this.minReading) {
      this.minReading = reading
    }

    const readingValue = Number(
      reading.diastolic < reading.systolic
        ? reading.diastolic
        : reading.systolic,
    )
    const currentMinValue = Number(
      this.minReading.diastolic < this.minReading.systolic
        ? this.minReading.diastolic
        : this.minReading.systolic,
    )

    if (currentMinValue > readingValue) {
      this.minReading = reading
    }
  }

  private updateMaxReading(reading: BloodPressure): void {
    if (!this.maxReading) {
      this.maxReading = reading
      return
    }

    const readingValue = Number(
      reading.diastolic > reading.systolic
        ? reading.diastolic
        : reading.systolic,
    )
    const currentMaxValue = Number(
      this.maxReading.diastolic > this.maxReading.systolic
        ? this.maxReading.diastolic
        : this.maxReading.systolic,
    )

    if (readingValue > currentMaxValue) {
      this.maxReading = reading
    }
  }

  public addReading(reading: BloodPressure): void {
    this.readings.push(reading)
    this.updateMinReading(reading)
    this.updateMaxReading(reading)
  }

  public getReadings(): BloodPressure[] {
    return this.readings
  }

  public getMaxReading(): BloodPressure | null {
    return this.maxReading
  }

  public getMinReading(): BloodPressure | null {
    return this.minReading
  }

  public getDiastolicAverage(): number {
    return (
      this.readings
        .map((reading) => reading.diastolic)
        .reduce((acc, cur) => acc + cur) / this.readings.length
    )
  }

  public getSystolicAverage(): number {
    return (
      this.readings
        .map((reading) => reading.systolic)
        .reduce((acc, cur) => acc + cur) / this.readings.length
    )
  }
}
