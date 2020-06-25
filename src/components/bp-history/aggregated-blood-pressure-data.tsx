import {DateEntry} from './date-entry'
import {BloodPressure} from '../../redux/blood-pressure/blood-pressure.models'
import {getChartDateRange, DateRange} from '../../utils/dates'
import {isSameDay} from 'date-fns'
import {zonedTimeToUtc} from 'date-fns-tz'

export class AggregatedBloodPressureData {
  private dateEntry: DateEntry

  private minReading: BloodPressure | null = null
  private maxReading: BloodPressure | null = null

  private readings: BloodPressure[] = []

  public constructor(dateEntry: DateEntry) {
    this.dateEntry = dateEntry
  }

  public getDateEntry(): DateEntry {
    return this.dateEntry
  }

  private updateMinReading(reading: BloodPressure): void {
    if (!this.minReading) {
      this.minReading = reading
    }

    const readingValue = Number(
      reading.diastolic < reading.systolic
        ? reading.diastolic
        : reading.systolic,
    )
    const currentMinValue = Number(
      this.minReading.diastolic < this.minReading.systolic
        ? this.minReading.diastolic
        : this.minReading.systolic,
    )

    if (currentMinValue > readingValue) {
      this.minReading = reading
    }
  }

  private updateMaxReading(reading: BloodPressure): void {
    if (!this.maxReading) {
      this.maxReading = reading
      return
    }

    const readingValue = Number(
      reading.diastolic > reading.systolic
        ? reading.diastolic
        : reading.systolic,
    )
    const currentMaxValue = Number(
      this.maxReading.diastolic > this.maxReading.systolic
        ? this.maxReading.diastolic
        : this.maxReading.systolic,
    )

    if (readingValue > currentMaxValue) {
      this.maxReading = reading
    }
  }

  private getIndexFromBP = (
    dates: DateRange[],
    input: BloodPressure,
  ): number | null => {
    let index = 0
    const found = dates.find((date, i) => {
      index = i

      return isSameDay(
        new Date(input.recorded_at),
        zonedTimeToUtc(new Date(date.date), 'UTC'),
      )
    })
    if (found) {
      return index
    } else {
      return null
    }
  }

  public generateAverageChartData = (
    input: BloodPressure[],
    calculateAverage: (current: DateRange) => number | {},
    isHigh: (value: any) => boolean,
  ) => {
    const dates: DateRange[] = getChartDateRange()

    let min: number | null = null
    let max: number | null = null

    input.forEach((value: BloodPressure) => {
      const index = this.getIndexFromBP(dates, value)

      if (index) {
        const valueMin = Number(this.getMinReading())
        const valueMax = Number(this.getMaxReading())
        if (!min || valueMin < min) {
          min = valueMin
        }
        if (!max || valueMax > max) {
          max = valueMax
        }
        if (dates[index]) {
          dates[index].list.push(value)
        }
      }
    })

    const reduction = dates.reduce(
      (memo: {high: []; low: []}, current) => {
        if (current.list.length) {
          const average: any = calculateAverage(current)

          if (isHigh(average)) {
            memo.high.push({...current, averaged: average})
          } else {
            memo.low.push({...current, averaged: average})
          }
        }
        return memo
      },
      {high: [], low: []},
    )

    return {dates, low: reduction.low, high: reduction.high, min, max}
  }

  public addReading(reading: BloodPressure): void {
    this.readings.push(reading)
    this.updateMinReading(reading)
    this.updateMaxReading(reading)
  }

  public getReadings(): BloodPressure[] {
    return this.readings
  }

  public getMaxReading(): BloodPressure | null {
    return this.maxReading
  }

  public getMinReading(): BloodPressure | null {
    return this.minReading
  }
}
