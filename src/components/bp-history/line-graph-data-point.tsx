import {AggregatedBloodPressureData} from './aggregated-blood-pressure-data'

export class LineGraphDataPoint {
  public x: number
  public y: number

  private constructor(
    index: number,
    aggregateRecord: AggregatedBloodPressureData,
    useDiastolic: boolean,
  ) {
    this.x = index
    this.y = useDiastolic
      ? aggregateRecord.getDiastolicAverage()
      : aggregateRecord.getSystolicAverage()
  }

  public static CreateForDiastolic(
    index: number,
    aggregateRecord: AggregatedBloodPressureData,
  ): LineGraphDataPoint {
    return new LineGraphDataPoint(index, aggregateRecord, true)
  }

  public static CreateForSystolic(
    index: number,
    aggregateRecord: AggregatedBloodPressureData,
  ): LineGraphDataPoint {
    return new LineGraphDataPoint(index, aggregateRecord, false)
  }
}
