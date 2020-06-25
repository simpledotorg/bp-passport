import {
  BloodSugar,
  BLOOD_SUGAR_TYPES,
} from '../../redux/blood-sugar/blood-sugar.models'

import {AggregatedBloodSugarData} from './aggregated-blood-sugar-data'
import {DateAxis} from './date-axis'
import {ScatterGraphDataPoint} from './scatter-graph-data-point'
import {RequestSingleMonthChart} from './request-single-month-chart'
import {RequestHemoglobicChart} from './request-hemoglobic-chart'
import {IDefineAChartRequest} from './i-define-a-chart-request'
import {IDefineAdateAxisLabel} from '../victory-chart-parts/i-define-a-date-axis-label'
import {format} from 'date-fns'
import {dateLocale} from '../../constants/languages'

export class ChartData {
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
    readings: BloodSugar[],
  ): BloodSugar[] {
    if (chartRequest instanceof RequestHemoglobicChart) {
      return readings
        .filterByTypes([BLOOD_SUGAR_TYPES.HEMOGLOBIC])
        .filterForYear(chartRequest.yearToDisplay)
    }
    if (chartRequest instanceof RequestSingleMonthChart) {
      switch (chartRequest.chartType) {
        case BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR:
          return readings
            .filterByTypes([BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR])
            .filterForMonthAndYear(
              chartRequest.requestedMonth,
              chartRequest.requestedYear,
            )
        case BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR:
        case BLOOD_SUGAR_TYPES.POST_PRANDIAL:
          return readings
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
    requestedChart: IDefineAChartRequest,
    readings: BloodSugar[],
  ): boolean {
    const oldestReading = readings
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
    readings: BloodSugar[],
  ): boolean {
    const mostRecentReading = readings
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
  private static getMonthName(month: number, year: number): string {
    return format(new Date(year, month, 1), 'MMM', {
      locale: dateLocale(),
    })
  }
  constructor(requestedChart: IDefineAChartRequest, readings: BloodSugar[]) {
    this._requestedChart = requestedChart

    this.hasRandomReadings = readings.hasReadingType(
      BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR,
    )
    this.hasPostPrandialReadings = readings.hasReadingType(
      BLOOD_SUGAR_TYPES.POST_PRANDIAL,
    )
    this.hasFastingReadings = readings.hasReadingType(
      BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR,
    )
    this.hasHemoglobicReadings = readings.hasReadingType(
      BLOOD_SUGAR_TYPES.HEMOGLOBIC,
    )

    const filteredReadings = ChartData.filterReadings(
      this._requestedChart,
      readings,
    )

    if (requestedChart instanceof RequestSingleMonthChart) {
      this.dateAxis = DateAxis.CreateForRequestedMonth(
        requestedChart.requestedMonth,
        requestedChart.requestedYear,
      )
      const monthName = ChartData.getMonthName(
        requestedChart.requestedMonth,
        requestedChart.requestedYear,
      )
      this._chartTitle = `${monthName}-${requestedChart.requestedYear}`
    } else if (requestedChart instanceof RequestHemoglobicChart) {
      this.dateAxis = DateAxis.CreateForYear(requestedChart.yearToDisplay)
      const jan = ChartData.getMonthName(0, requestedChart.yearToDisplay)
      const dec = ChartData.getMonthName(11, requestedChart.yearToDisplay)
      this._chartTitle = `${jan} - ${dec}-${requestedChart.yearToDisplay}`
    } else {
      throw new Error('Chart type is not handled')
    }

    this._hasPreviousPeriod = ChartData.determineIfHasPreviousPeriod(
      requestedChart,
      readings,
    )
    this._hasNextPeriod = ChartData.determineIfHasNextPeriod(
      requestedChart,
      readings,
    )

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
      if (
        !aggregateRecord.getMinReading() ||
        !aggregateRecord.getMaxReading()
      ) {
        return
      }

      const minValue = Number(
        aggregateRecord.getMinReading()?.blood_sugar_value,
      )
      const maxValue = Number(
        aggregateRecord.getMaxReading()?.blood_sugar_value,
      )

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
        const maxValueForCurrentDay = current.getMaxReading()
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
        const minValueForCurrentDay = current.getMinReading()
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
