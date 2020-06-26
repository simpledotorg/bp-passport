import {DateEntry} from '../victory-chart-parts/date-entry'
import {BloodPressure} from '../../redux/blood-pressure/blood-pressure.models'

export class AggregatedBloodPressureData {
  private dateEntry: DateEntry

  private avgDiastolicReading: number | null
  private minDiastolicReading: number | null
  private maxDiastolicReading: number | null

  private avgSystolicReading: number | null
  private minSystolicReading: number | null
  private maxSystolicReading: number | null

  private readings: BloodPressure[] = []

  public constructor(dateEntry: DateEntry) {
    this.dateEntry = dateEntry
  }

  public getDateEntry(): DateEntry {
    return this.dateEntry
  }

  public addReading(reading: BloodPressure): void {
    this.readings.push(reading)

    this.minDiastolicReading = null
    this.maxDiastolicReading = null
    this.avgDiastolicReading = null

    this.minSystolicReading = null
    this.maxSystolicReading = null
    this.avgSystolicReading = null
  }

  public getReadings(): BloodPressure[] {
    return this.readings
  }

  public getMaxDiastolicReading(): number | null {
    if (!this.maxDiastolicReading) {
      this.maxDiastolicReading = this.readings.getMaxValue(true)
    }

    return this.maxDiastolicReading
  }

  public getMinDiastolicReading(): number | null {
    if (!this.minDiastolicReading) {
      this.minDiastolicReading = this.readings.getMinValue(true)
    }

    return this.minDiastolicReading
  }

  public getMaxSystolicReading(): number | null {
    if (!this.maxSystolicReading) {
      this.maxSystolicReading = this.readings.getMaxValue(false)
    }
    return this.maxSystolicReading
  }

  public getMinSystolicReading(): number | null {
    if (!this.minSystolicReading) {
      this.minSystolicReading = this.readings.getMinValue(false)
    }

    return this.minSystolicReading
  }

  public getDiastolicAverage(): number | null {
    if (!this.avgDiastolicReading) {
      this.avgDiastolicReading = this.readings.getAvgValue(true)
    }

    return this.avgDiastolicReading
  }

  public getSystolicAverage(): number | null {
    if (!this.avgSystolicReading) {
      this.avgSystolicReading = this.readings.getAvgValue(false)
    }

    return this.avgSystolicReading
  }
}
