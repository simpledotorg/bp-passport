import {AggregatedBloodPressureData} from './aggregated-blood-pressure-data'
import {DateAxis} from '../victory-chart-parts/date-axis'
import {ScatterGraphDataPoint} from '../bp-history/scatter-graph-data-point'
import {LineGraphDataPoint} from '../bp-history/line-graph-data-point'
import {IDefineAdateAxisLabel} from '../victory-chart-parts/i-define-a-date-axis-label'
import {ChartRequest} from './../bp-history/chart-request'
import {getMonthYearTitle} from '../../utils/dates'

export class ChartData {
  private readonly dateAxis: DateAxis
  private readonly aggregatedData: AggregatedBloodPressureData[] = []

  private readonly _chartTitle: string

  private readonly _hasNextPeriod: boolean
  private readonly _hasPreviousPeriod: boolean

  constructor(requestedChart: ChartRequest) {
    this.dateAxis = DateAxis.CreateForRequestedMonth(
      requestedChart.requestedMonth,
      requestedChart.requestedYear,
    )

    this._chartTitle = getMonthYearTitle(
      requestedChart.requestedMonth,
      requestedChart.requestedYear,
    )

    this._hasPreviousPeriod = requestedChart.determineIfHasPreviousPeriod()
    this._hasNextPeriod = requestedChart.determineIfHasNextPeriod()

    requestedChart.readings.forEach((bloodPressureReading) => {
      const dateEntry = this.dateAxis.getDateEntryFor(bloodPressureReading)
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

  private static removeNulls = (values: (number | null)[]): number[] => {
    const returnValues: number[] = []
    values.forEach((value) => {
      if (value) {
        returnValues.push(value)
      }
    })
    return returnValues
  }

  public getMaxDataValue(): number | null {
    return this.aggregatedData.reduce(
      (
        memo: number | null,
        current: AggregatedBloodPressureData,
      ): number | null => {
        return Math.max(
          ...ChartData.removeNulls([
            current.getMaxDiastolicReading(),
            current.getMaxSystolicReading(),
            memo,
          ]),
        )
      },
      null,
    )
  }

  public getMinDataValue(): number | null {
    return this.aggregatedData.reduce(
      (
        memo: number | null,
        current: AggregatedBloodPressureData,
      ): number | null => {
        return Math.min(
          ...ChartData.removeNulls([
            current.getMinDiastolicReading(),
            current.getMinSystolicReading(),
            memo,
          ]),
        )
      },
      null,
    )
  }

  public getIndexValues(): number[] {
    return this.dateAxis.getDates().map((dateEntry) => {
      return dateEntry.getIndex()
    })
  }

  public getAxisTickValues(): IDefineAdateAxisLabel[] {
    return this.dateAxis.getAxisTickValues()
  }

  public getTitle(): string {
    return this._chartTitle
  }

  public hasNextPeriod(): boolean {
    return this._hasNextPeriod
  }

  public hasPreviousPeriod(): boolean {
    return this._hasPreviousPeriod
  }
}
