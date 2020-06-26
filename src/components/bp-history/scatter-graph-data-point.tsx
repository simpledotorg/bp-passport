import {getLocalisedShortDate} from '../../utils/dates'
import {BloodPressure} from '../../redux/blood-pressure/blood-pressure.models'
import {AggregatedBloodPressureData} from './aggregated-blood-pressure-data'

export class ScatterGraphDataPoint {
  public x: number
  public y: number
  public label: string
  public showOutOfRange: boolean

  private constructor(
    index: number,
    aggregateRecord: AggregatedBloodPressureData,
    useDiastolic: boolean,
  ) {
    const diastolicAverage = aggregateRecord.getDiastolicAverage()
    const systolicAverage = aggregateRecord.getSystolicAverage()

    this.x = index

    const value = useDiastolic ? diastolicAverage : systolicAverage
    if (value) {
      this.y = value

      this.label = `${systolicAverage?.toFixed(
        0,
      )} / ${diastolicAverage?.toFixed(0)}, ${getLocalisedShortDate(
        aggregateRecord.getDateEntry().getDate(),
      )}`

      this.showOutOfRange =
        this.y >=
        (useDiastolic
          ? BloodPressure.diastolicUpperThreshold
          : BloodPressure.systolicUpperThreshold)
    }
  }

  public static CreateForDiastolic(
    index: number,
    aggregateRecord: AggregatedBloodPressureData,
  ): ScatterGraphDataPoint {
    return new ScatterGraphDataPoint(index, aggregateRecord, true)
  }

  public static CreateForSystolic(
    index: number,
    aggregateRecord: AggregatedBloodPressureData,
  ): ScatterGraphDataPoint {
    return new ScatterGraphDataPoint(index, aggregateRecord, false)
  }
}
