import {AggregatedBloodPressureData} from './aggregated-blood-pressure-data'
import {DateAxis} from './date-axis'
import {BloodPressure} from '../../redux/blood-pressure/blood-pressure.models'
import {ScatterGraphDataPoint} from '../bp-history/scatter-graph-data-point'
import {LineGraphDataPoint} from '../bp-history/line-graph-data-point'
import {IDefineAdateAxisLabel} from '../victory-chart-parts/i-define-a-date-axis-label'
import {ChartRequest} from './../bp-history/chart-request'
import {format} from 'date-fns'
import {dateLocale} from '../../constants/languages'

export class ChartData {
  private readonly _requestedChart: ChartRequest

  private readonly dateAxis: DateAxis
  private readonly aggregatedData: AggregatedBloodPressureData[] = []

  private readonly _chartTitle: string

  private readonly _hasNextPeriod: boolean
  private readonly _hasPreviousPeriod: boolean

  private static getMonthName(month: number, year: number): string {
    return format(new Date(year, month, 1), 'MMM', {
      locale: dateLocale(),
    })
  }

  private static determineIfHasPreviousPeriod(
    requestedChart: ChartRequest,
    readings: BloodPressure[],
  ): boolean {
    const oldestReading = readings.oldest()
    if (oldestReading === null) {
      return false
    }

    const dateOfOldestReading = new Date(oldestReading.recorded_at)

    if (requestedChart.requestedYear < dateOfOldestReading.getFullYear()) {
      return false
    }
    if (requestedChart.requestedYear > dateOfOldestReading.getFullYear()) {
      return true
    }

    return requestedChart.requestedMonth > dateOfOldestReading.getMonth()
  }

  private static determineIfHasNextPeriod(
    requestedChart: ChartRequest,
    readings: BloodPressure[],
  ): boolean {
    const mostRecentReading = readings.mostRecent()
    if (mostRecentReading === null) {
      return false
    }

    const dateOfMostRecentReading = new Date(mostRecentReading.recorded_at)

    if (requestedChart.requestedYear > dateOfMostRecentReading.getFullYear()) {
      return false
    }
    if (requestedChart.requestedYear < dateOfMostRecentReading.getFullYear()) {
      return true
    }

    return requestedChart.requestedMonth < dateOfMostRecentReading.getMonth()
  }

  constructor(requestedChart: ChartRequest, readings: BloodPressure[]) {
    this._requestedChart = requestedChart

    this.dateAxis = DateAxis.CreateForRequestedMonth(
      requestedChart.requestedMonth,
      requestedChart.requestedYear,
    )

    const monthName = ChartData.getMonthName(
      requestedChart.requestedMonth,
      requestedChart.requestedYear,
    )

    this._chartTitle = `${monthName}-${requestedChart.requestedYear}`

    this._hasPreviousPeriod = ChartData.determineIfHasPreviousPeriod(
      requestedChart,
      readings,
    )
    this._hasNextPeriod = ChartData.determineIfHasNextPeriod(
      requestedChart,
      readings,
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
