import {AggregatedBloodPressureData} from './aggregated-blood-pressure-data'
import {DateAxis} from './date-axis'
import {BloodPressure} from '../../redux/blood-pressure/blood-pressure.models'
import {ScatterGraphDataPoint} from '../bp-history/scatter-graph-data-point'
import {LineGraphDataPoint} from '../bp-history/line-graph-data-point'

export class ChartData {
  private readonly dateAxis: DateAxis
  private readonly aggregatedData: AggregatedBloodPressureData[] = []

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

      data.push(
        ScatterGraphDataPoint.CreateForDiastolic(index, aggregateRecord),
      )
      data.push(ScatterGraphDataPoint.CreateForSystolic(index, aggregateRecord))
    })

    return data
  }

  public getLineGraph(useDiastolic: boolean): LineGraphDataPoint[] {
    const data: LineGraphDataPoint[] = []
    this.aggregatedData.forEach((aggregateRecord) => {
      const index = aggregateRecord.getDateEntry().getIndex()

      if (useDiastolic) {
        data.push(LineGraphDataPoint.CreateForDiastolic(index, aggregateRecord))
      } else {
        data.push(LineGraphDataPoint.CreateForSystolic(index, aggregateRecord))
      }
    })

    return data
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

        const currentValue = Number(maxValueForCurrentDay.systolic)

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

        const currentValue = Number(minValueForCurrentDay.systolic)

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
