import {DateEntry} from '../victory-chart-parts/date-entry'
import ConvertedBloodSugarReading from '../../models/converted_blood_sugar_reading'
import {ScatterGraphDataPoint} from './scatter-graph-data-point'
import {LineGraphDataPoint} from './line-graph-data-point'

export class AggregatedBloodSugarData {
  private dateEntry: DateEntry

  private _minReading: ConvertedBloodSugarReading | null = null
  private _maxReading: ConvertedBloodSugarReading | null = null

  private readings: ConvertedBloodSugarReading[] = []

  public constructor(dateEntry: DateEntry) {
    this.dateEntry = dateEntry
  }

  public getDateEntry(): DateEntry {
    return this.dateEntry
  }

  public addReading(reading: ConvertedBloodSugarReading): void {
    this.readings.push(reading)
    this._maxReading = null
    this._minReading = null
  }

  public getReadings(): ConvertedBloodSugarReading[] {
    return this.readings
  }

  public get maxReading(): ConvertedBloodSugarReading | null {
    if (!this._maxReading) {
      this._maxReading = this.readings.getMaxReading()
    }
    return this._maxReading
  }

  public get minReading(): ConvertedBloodSugarReading | null {
    if (!this._minReading) {
      this._minReading = this.readings.getMinReading()
    }
    return this._minReading
  }
}

declare global {
  interface Array<T> {
    // tslint:disable-next-line: array-type
    getScatterDataForGraph(): ScatterGraphDataPoint[]

    getLineGraphData(): LineGraphDataPoint[]
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

if (!Array.prototype.getLineGraphData) {
  Array.prototype.getLineGraphData = function <
    T extends AggregatedBloodSugarData
  >(this: T[]): LineGraphDataPoint[] {
    const data: LineGraphDataPoint[] = []
    this.forEach((aggregateRecord) => {
      const index = aggregateRecord.getDateEntry().getIndex()
      aggregateRecord.getReadings().forEach((reading) => {
        data.push(new LineGraphDataPoint(index, reading))
      })
    })
    return data
  }
}
