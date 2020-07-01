import {BLOOD_SUGAR_TYPES} from '../../redux/blood-sugar/blood-sugar.models'

import {AggregatedBloodSugarData} from './aggregated-blood-sugar-data'
import {DateAxis} from '../victory-chart-parts/date-axis'
import {ScatterGraphDataPoint} from './scatter-graph-data-point'
import {RequestSingleMonthChart} from './request-single-month-chart'
import {RequestHemoglobicChart} from './request-hemoglobic-chart'
import {
  IDefineAChartRequest,
  filterReadings,
  determineIfHasPreviousPeriod,
  determineIfHasNextPeriod,
} from './i-define-a-chart-request'
import {IDefineAdateAxisLabel} from '../victory-chart-parts/i-define-a-date-axis-label'
import {getMonthYearTitle, getYearTitle} from '../../utils/dates'
import {IDefineChartsAvailable} from './i-define-charts-available'
import {LineGraphDataPoint} from './line-graph-data-point'
import ConvertedBloodSugarReading from '../../models/converted_blood_sugar_reading'
import {BloodSugarCode, determinePrecision} from '../../utils/blood-sugars'

export class ChartData implements IDefineChartsAvailable {
  private readonly _requestedChart: IDefineAChartRequest
  private readonly _chartTitle: string
  private readonly hasRandomReadings: boolean
  private readonly hasPostPrandialReadings: boolean
  private readonly hasFastingReadings: boolean
  private readonly hasHemoglobicReadings: boolean
  private readonly hasBeforeEatingReadings: boolean
  private readonly hasAfterEatingReadings: boolean
  private readonly dateAxis: DateAxis
  private readonly aggregatedData: AggregatedBloodSugarData[] = []
  private readonly _hasNextPeriod: boolean
  private readonly _hasPreviousPeriod: boolean

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

    this.hasBeforeEatingReadings = requestedChart.readings.hasReadingType(
      BLOOD_SUGAR_TYPES.BEFORE_EATING,
    )
    this.hasAfterEatingReadings = requestedChart.readings.hasReadingType(
      BLOOD_SUGAR_TYPES.AFTER_EATING,
    )

    const filteredReadings = filterReadings(this._requestedChart)

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

    this._hasPreviousPeriod = determineIfHasPreviousPeriod(requestedChart)
    this._hasNextPeriod = determineIfHasNextPeriod(requestedChart)

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

      aggregateRecord.addReading(
        new ConvertedBloodSugarReading(
          bloodSugarReading,
          this._requestedChart.getDisplayUnits(),
        ),
      )
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

  public getDisplayUnits(): BloodSugarCode {
    return this._requestedChart.getDisplayUnits()
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

  public getHasBeforeEatingReadings(): boolean {
    return this.hasBeforeEatingReadings
  }

  public getHasAfterEatingReadings(): boolean {
    return this.hasAfterEatingReadings
  }

  public getHasHemoglobicReadings(): boolean {
    return this.hasHemoglobicReadings
  }

  public getMaxReading(): number | null {
    const value = this.aggregatedData.reduce(
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

    return value
      ? Number(
          value.toFixed(
            determinePrecision(this._requestedChart.getDisplayUnits()),
          ),
        )
      : null
  }

  public getMinReading(): number | null {
    const value = this.aggregatedData.reduce(
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

    return value
      ? Number(
          value.toFixed(
            determinePrecision(this._requestedChart.getDisplayUnits()),
          ),
        )
      : null
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

  public get displayLineGraph(): boolean {
    return this._requestedChart.chartType === BLOOD_SUGAR_TYPES.HEMOGLOBIC
  }

  public getLineGraphData(): LineGraphDataPoint[] {
    if (this.displayLineGraph) {
      return this.aggregatedData.getLineGraphData()
    }

    return []
  }
}
