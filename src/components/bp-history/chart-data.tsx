import {AggregatedBloodPressureData} from './aggregated-blood-pressure-data'
import {DateRange} from '../../utils/dates'
import {DateAxis} from './date-axis'
import {BloodPressure} from '../../redux/blood-pressure/blood-pressure.models'
import {ScatterGraphDataPoint} from '../bp-history/scatter-graph-data-point'

export class ChartData {
  private readonly dateAxis: DateAxis
  private readonly aggregatedData: AggregatedBloodPressureData[] = []

  dates: DateRange[]
  low: DateRange[]
  high: DateRange[]
  min: null | number
  max: null | number

  constructor(readings: BloodPressure[]) {
    this.dateAxis = DateAxis.CreateMostRecentMonthsFromBloodPressures(
      readings,
      2,
    )

    readings.forEach((bloodPressureReading) => {
      const dateEntry = this.dateAxis.getDateEntryForBloodPressure(
        bloodPressureReading,
      )
      if (!dateEntry) {
        return
      }

      let aggregateRecord = this.aggregatedData.find((record) => {
        return record.getDateEntry() === dateEntry
      })

      if (aggregateRecord === undefined) {
        aggregateRecord = new AggregatedBloodPressureData(dateEntry)
        this.aggregatedData.push(aggregateRecord)
      }

      aggregateRecord.addReading(bloodPressureReading)
    })
  }

  public getScatterDataForGraph(): ScatterGraphDataPoint[] {
    const data: ScatterGraphDataPoint[] = []
    this.aggregatedData.forEach((aggregateRecord) => {
      const index = aggregateRecord.getDateEntry().getIndex()
      aggregateRecord.getReadings().forEach((reading) => {
        data.push(new ScatterGraphDataPoint(index, reading))
      })
    })
    return data
  }

  public getMinMaxDataForGraph(): {
    index: number
    min: number
    max: number
  }[] {
    const values: {index: number; min: number; max: number}[] = []
    this.aggregatedData.forEach((aggregateRecord) => {
      if (
        !aggregateRecord.getMinReading() ||
        !aggregateRecord.getMaxReading()
      ) {
        return
      }

      const minValue = Number(aggregateRecord.getMinReading()?.diastolic)
      const maxValue = Number(aggregateRecord.getMaxReading()?.diastolic)

      if (minValue === maxValue) {
        return
      }

      values.push({
        index: aggregateRecord.getDateEntry().getIndex(),
        min: minValue,
        max: maxValue,
      })
    })

    return values
  }

  public getMaxReading(): number | null {
    return this.aggregatedData.reduce(
      (
        memo: number | null,
        current: AggregatedBloodPressureData,
      ): number | null => {
        const maxValueForCurrentDay = current.getMaxReading()
        if (!maxValueForCurrentDay) {
          return memo
        }

        const currentValue = Number(maxValueForCurrentDay.diastolic)

        return !memo || currentValue > memo ? currentValue : memo
      },
      null,
    )
  }

  public getMinReading(): number | null {
    return this.aggregatedData.reduce(
      (
        memo: number | null,
        current: AggregatedBloodPressureData,
      ): number | null => {
        const minValueForCurrentDay = current.getMinReading()
        if (!minValueForCurrentDay) {
          return memo
        }

        const currentValue = Number(minValueForCurrentDay.diastolic)

        return !memo || currentValue < memo ? currentValue : memo
      },
      null,
    )
  }

  public getIndexValues(): number[] {
    return this.dateAxis.getDates().map((dateEntry) => {
      return dateEntry.getIndex()
    })
  }

  public getAxisTickValues(): {
    month: number
    monthName: string
    year: number
  }[] {
    return this.dateAxis.getAxisTickValues()
  }
}
