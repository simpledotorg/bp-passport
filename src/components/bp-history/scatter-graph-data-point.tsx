import {BloodPressure} from '../../redux/blood-pressure/blood-pressure.models'
import {useIntl} from 'react-intl'
import {format} from 'date-fns'
import {AggregatedBloodPressureData} from './aggregated-blood-pressure-data'

export class ScatterGraphDataPoint {
  private intl = useIntl()

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
    this.y = useDiastolic ? diastolicAverage : systolicAverage
    this.label = `${systolicAverage.toFixed(0)} / ${diastolicAverage.toFixed(
      0,
    )}, ${format(aggregateRecord.getDateEntry().getDate(), 'dd-MMM-yyyy')}`

    if (useDiastolic) {
      this.showOutOfRange = this.y >= 140
    } else {
      this.showOutOfRange = this.y >= 90
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
