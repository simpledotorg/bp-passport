import {DateEntry} from '../victory-chart-parts/date-entry'
import {BloodSugar} from '../../redux/blood-sugar/blood-sugar.models'
import {ScatterGraphDataPoint} from './scatter-graph-data-point'

export class AggregatedBloodSugarData {
  private dateEntry: DateEntry

  private _minReading: BloodSugar | null = null
  private _maxReading: BloodSugar | null = null

  private readings: BloodSugar[] = []

  public constructor(dateEntry: DateEntry) {
    this.dateEntry = dateEntry
  }

  public getDateEntry(): DateEntry {
    return this.dateEntry
  }

  private static getMinReading(readings: BloodSugar[]): BloodSugar | null {
    return readings.reduce(
      (memo: BloodSugar | null, current: BloodSugar): BloodSugar | null => {
        const readingValue = Number(current.blood_sugar_value)

        if (!memo) {
          return current
        }

        return Number(memo.blood_sugar_value) < readingValue ? memo : current
      },
      null,
    )
  }

  private static getMaxReading(readings: BloodSugar[]): BloodSugar | null {
    return readings.reduce(
      (memo: BloodSugar | null, current: BloodSugar): BloodSugar | null => {
        const readingValue = Number(current.blood_sugar_value)

        if (!memo) {
          return current
        }

        return Number(memo.blood_sugar_value) > readingValue ? memo : current
      },
      null,
    )
  }

  public addReading(reading: BloodSugar): void {
    this.readings.push(reading)
    this._maxReading = null
    this._minReading = null
  }

  public getReadings(): BloodSugar[] {
    return this.readings
  }

  public get maxReading(): BloodSugar | null {
    if (!this._maxReading) {
      this._maxReading = AggregatedBloodSugarData.getMaxReading(this.readings)
    }
    return this._maxReading
  }

  public get minReading(): BloodSugar | null {
    if (!this._minReading) {
      this._minReading = AggregatedBloodSugarData.getMinReading(this.readings)
    }
    return this._minReading
  }
}

declare global {
  interface Array<T> {
    // tslint:disable-next-line: array-type
    getScatterDataForGraph(): ScatterGraphDataPoint[]
  }
}

if (!Array.prototype.getScatterDataForGraph) {
  Array.prototype.getScatterDataForGraph = function <
    T extends AggregatedBloodSugarData
  >(this: T[]): ScatterGraphDataPoint[] {
    const data: ScatterGraphDataPoint[] = []

    this.forEach((aggregateRecord) => {
      const index = aggregateRecord.getDateEntry().getIndex()
      aggregateRecord.getReadings().forEach((reading) => {
        data.push(new ScatterGraphDataPoint(index, reading))
      })
    })

    return data
  }
}
