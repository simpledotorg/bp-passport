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

export class ChartData {
  private readonly _requestedChart: IDefineAChartRequest

  private readonly hasRandomReadings: boolean
  private readonly hasPostPrandialReadings: boolean
  private readonly hasFastingReadings: boolean
  private readonly hasHemoglobicReadings: boolean

  private readonly dateAxis: DateAxis
  private readonly aggregatedData: AggregatedBloodSugarData[] = []

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
    } else if (requestedChart instanceof RequestHemoglobicChart) {
      this.dateAxis = DateAxis.CreateForYear(requestedChart.yearToDisplay)
    } else {
      throw new Error('Chart type is not handled')
    }

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
    return 'Demo Graph'
  }

  public hasNextPeriod(): boolean {
    return false
  }

  public hasPreviousPeriod(): boolean {
    return true
  }
}
