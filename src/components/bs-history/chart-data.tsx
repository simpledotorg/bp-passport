import {
  BloodSugar,
  BLOOD_SUGAR_TYPES,
} from '../../redux/blood-sugar/blood-sugar.models'
import {CHART_MONTH_RANGE} from '../../utils/dates'
import {AggregatedBloodSugarData} from './aggregated-blood-sugar-data'
import {DateAxis} from './date-axis'
import {ScatterGraphDataPoint} from './scatter-graph-data-point'

export class ChartData {
  private readonly chartType: BLOOD_SUGAR_TYPES
  private readonly dateAxis: DateAxis
  private readonly aggregatedData: AggregatedBloodSugarData[] = []

  private static filterReadingsByTypes(
    types: BLOOD_SUGAR_TYPES[],
    readings: BloodSugar[],
  ): BloodSugar[] {
    return readings.filter((reading) => {
      return types.find((type) => {
        return type === reading.blood_sugar_type
      })
    })
  }

  private static filterReadings(
    chartType: BLOOD_SUGAR_TYPES,
    readings: BloodSugar[],
  ): BloodSugar[] {
    switch (chartType) {
      case BLOOD_SUGAR_TYPES.HEMOGLOBIC:
        return ChartData.filterReadingsByTypes(
          [BLOOD_SUGAR_TYPES.HEMOGLOBIC],
          readings,
        )
      case BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR:
        return ChartData.filterReadingsByTypes(
          [BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR],
          readings,
        )
      case BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR:
      case BLOOD_SUGAR_TYPES.POST_PRANDIAL:
        return ChartData.filterReadingsByTypes(
          [
            BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR,
            BLOOD_SUGAR_TYPES.POST_PRANDIAL,
          ],
          readings,
        )
      default:
        throw new Error('Requested blood sugar type not handled')
    }
  }

  constructor(chartType: BLOOD_SUGAR_TYPES, readings: BloodSugar[]) {
    this.chartType = chartType

    const filteredReadings = ChartData.filterReadings(chartType, readings)

    this.dateAxis = DateAxis.CreateMostRecentMonthsFromBloodSugars(
      filteredReadings,
      CHART_MONTH_RANGE,
    )

    filteredReadings.forEach((bloodSugarReading) => {
      const dateEntry = this.dateAxis.getDateEntryForBloodSugar(
        bloodSugarReading,
      )
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
    const data: ScatterGraphDataPoint[] = []
    this.aggregatedData.forEach((aggregateRecord) => {
      const index = aggregateRecord.getDateEntry().getIndex()
      aggregateRecord.getReadings().forEach((reading) => {
        data.push(new ScatterGraphDataPoint(index, reading))
      })
    })
    return data
  }

  public getChartType(): BLOOD_SUGAR_TYPES {
    return this.chartType
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

        return !memo || maxValueForCurrentDay > memo
          ? maxValueForCurrentDay
          : memo
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

        return !memo || minValueForCurrentDay < memo
          ? minValueForCurrentDay
          : memo
      },
      null,
    )
  }

  public getIndexValues(): number[] {
    return this.dateAxis.getDates().map((dateEntry) => {
      return dateEntry.getIndex()
    })
  }
}
