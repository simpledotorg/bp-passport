import {
  BloodSugar,
  BLOOD_SUGAR_TYPES,
} from '../../redux/blood-sugar/blood-sugar.models'

import {AggregatedBloodSugarData} from './aggregated-blood-sugar-data'
import {DateAxis} from '../victory-chart-parts/date-axis'
import {ScatterGraphDataPoint} from './scatter-graph-data-point'
import {RequestSingleMonthChart} from './request-single-month-chart'
import {RequestHemoglobicChart} from './request-hemoglobic-chart'
import {IDefineAChartRequest} from './i-define-a-chart-request'
import {IDefineAdateAxisLabel} from '../victory-chart-parts/i-define-a-date-axis-label'
import {getMonthYearTitle, getYearTitle} from '../../utils/dates'
import {IDefineChartsAvailable} from './i-define-charts-available'

export class ChartData implements IDefineChartsAvailable {
  private readonly _requestedChart: IDefineAChartRequest
  private readonly _chartTitle: string
  private readonly hasRandomReadings: boolean
  private readonly hasPostPrandialReadings: boolean
  private readonly hasFastingReadings: boolean
  private readonly hasHemoglobicReadings: boolean

  private readonly dateAxis: DateAxis
  private readonly aggregatedData: AggregatedBloodSugarData[] = []
  private readonly _hasNextPeriod: boolean
  private readonly _hasPreviousPeriod: boolean

  private static filterReadings(
    chartRequest: IDefineAChartRequest,
  ): BloodSugar[] {
    if (chartRequest instanceof RequestHemoglobicChart) {
      return chartRequest.readings
        .filterByTypes([BLOOD_SUGAR_TYPES.HEMOGLOBIC])
        .filterForYear(chartRequest.yearToDisplay)
    }
    if (chartRequest instanceof RequestSingleMonthChart) {
      switch (chartRequest.chartType) {
        case BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR:
          return chartRequest.readings
            .filterByTypes([BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR])
            .filterForMonthAndYear(
              chartRequest.requestedMonth,
              chartRequest.requestedYear,
            )
        case BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR:
        case BLOOD_SUGAR_TYPES.POST_PRANDIAL:
          return chartRequest.readings
            .filterByTypes([
              BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR,
              BLOOD_SUGAR_TYPES.POST_PRANDIAL,
            ])
            .filterForMonthAndYear(
              chartRequest.requestedMonth,
              chartRequest.requestedYear,
            )

        default:
          throw new Error('Requested blood sugar type not handled')
      }
    }

    throw new Error('Requested chart type not handled')
  }

  private static determineIfHasPreviousPeriod(
    requestedChart: IDefineAChartRequest
  ): boolean {
    const oldestReading = requestedChart.readings
      .filterByType(requestedChart.chartType)
      .oldest()
    if (oldestReading === null) {
      return false
    }

    const dateOfOldestReading = new Date(oldestReading.recorded_at)

    if (requestedChart instanceof RequestSingleMonthChart) {
      if (requestedChart.requestedYear < dateOfOldestReading.getFullYear()) {
        return false
      }
      if (requestedChart.requestedYear > dateOfOldestReading.getFullYear()) {
        return true
      }

      return requestedChart.requestedMonth > dateOfOldestReading.getMonth()
    } else if (requestedChart instanceof RequestHemoglobicChart) {
      return dateOfOldestReading.getFullYear() < requestedChart.yearToDisplay
    } else {
      throw new Error('Chart type is not handled')
    }
  }

  private static determineIfHasNextPeriod(
    requestedChart: IDefineAChartRequest,
  ): boolean {
    const mostRecentReading = requestedChart.readings
      .filterByType(requestedChart.chartType)
      .mostRecent()
    if (mostRecentReading === null) {
      return false
    }

    const dateOfMostRecentReading = new Date(mostRecentReading.recorded_at)

    if (requestedChart instanceof RequestSingleMonthChart) {
      if (
        requestedChart.requestedYear > dateOfMostRecentReading.getFullYear()
      ) {
        return false
      }
      if (
        requestedChart.requestedYear < dateOfMostRecentReading.getFullYear()
      ) {
        return true
      }

      return requestedChart.requestedMonth < dateOfMostRecentReading.getMonth()
    } else if (requestedChart instanceof RequestHemoglobicChart) {
      return (
        dateOfMostRecentReading.getFullYear() > requestedChart.yearToDisplay
      )
    } else {
      throw new Error('Chart type is not handled')
    }
  }

  constructor(requestedChart: IDefineAChartRequest) {
    this._requestedChart = requestedChart

    this.hasRandomReadings = requestedChart.readings.hasReadingType(
      BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR,
    )
    this.hasPostPrandialReadings = requestedChart.readings.hasReadingType(
      BLOOD_SUGAR_TYPES.POST_PRANDIAL,
    )
    this.hasFastingReadings = requestedChart.readings.hasReadingType(
      BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR,
    )
    this.hasHemoglobicReadings = requestedChart.readings.hasReadingType(
      BLOOD_SUGAR_TYPES.HEMOGLOBIC,
    )

    const filteredReadings = ChartData.filterReadings(this._requestedChart)

    if (requestedChart instanceof RequestSingleMonthChart) {
      this.dateAxis = DateAxis.CreateForRequestedMonth(
        requestedChart.requestedMonth,
        requestedChart.requestedYear,
      )
      this._chartTitle = getMonthYearTitle(
        requestedChart.requestedMonth,
        requestedChart.requestedYear,
      )
    } else if (requestedChart instanceof RequestHemoglobicChart) {
      this.dateAxis = DateAxis.CreateForYear(requestedChart.yearToDisplay)
      this._chartTitle = getYearTitle(requestedChart.yearToDisplay)
    } else {
      throw new Error('Chart type is not handled')
    }

    this._hasPreviousPeriod = ChartData.determineIfHasPreviousPeriod(
      requestedChart,
    )
    this._hasNextPeriod = ChartData.determineIfHasNextPeriod(requestedChart)

    filteredReadings.forEach((bloodSugarReading) => {
      const dateEntry = this.dateAxis.getDateEntryFor(bloodSugarReading)
      if (!dateEntry) {
        return
      }

      let aggregateRecord = this.aggregatedData.find((record) => {
        return record.getDateEntry() === dateEntry
      })

      if (aggregateRecord === undefined) {
        aggregateRecord = new AggregatedBloodSugarData(dateEntry)
        this.aggregatedData.push(aggregateRecord)
      }

      aggregateRecord.addReading(bloodSugarReading)
    })
  }

  public getScatterDataForGraph(): ScatterGraphDataPoint[] {
    return this.aggregatedData.getScatterDataForGraph()
  }

  public getMinMaxDataForGraph(): {index: number; min: number; max: number}[] {
    const values: {index: number; min: number; max: number}[] = []
    this.aggregatedData.forEach((aggregateRecord) => {
      if (!aggregateRecord.minReading || !aggregateRecord.maxReading) {
        return
      }

      const minValue = Number(aggregateRecord.minReading?.blood_sugar_value)
      const maxValue = Number(aggregateRecord.maxReading?.blood_sugar_value)

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

  public getChartType(): BLOOD_SUGAR_TYPES {
    return this._requestedChart.chartType
  }

  public getHasRandomReadings(): boolean {
    return this.hasRandomReadings
  }

  public getHasPostPrandialReadings(): boolean {
    return this.hasPostPrandialReadings
  }

  public getHasFastingReadings(): boolean {
    return this.hasFastingReadings
  }

  public getHasHemoglobicReadings(): boolean {
    return this.hasHemoglobicReadings
  }

  public getMaxReading(): number | null {
    return this.aggregatedData.reduce(
      (
        memo: number | null,
        current: AggregatedBloodSugarData,
      ): number | null => {
        const maxValueForCurrentDay = current.maxReading
        if (!maxValueForCurrentDay) {
          return memo
        }

        const currentValue = Number(maxValueForCurrentDay.blood_sugar_value)

        return !memo || currentValue > memo ? currentValue : memo
      },
      null,
    )
  }

  public getMinReading(): number | null {
    return this.aggregatedData.reduce(
      (
        memo: number | null,
        current: AggregatedBloodSugarData,
      ): number | null => {
        const minValueForCurrentDay = current.minReading
        if (!minValueForCurrentDay) {
          return memo
        }

        const currentValue = Number(minValueForCurrentDay.blood_sugar_value)

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
