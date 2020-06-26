export class BloodPressure {
  diastolic: number
  systolic: number
  // tslint:disable-next-line: variable-name
  recorded_at: string /* 2019-07-08T18:51:27.255Z */
  facility?: {
    country: string
    district: string
    name: string
    pin: string
    state: string
    street_address: string
    village_or_colony: string
  }
  offline?: boolean

  static get diastolicUpperThreshold(): number {
    return 140
  }

  static get systolicUpperThreshold(): number {
    return 90
  }
}

declare global {
  interface Array<T> {
    getMinValue(this: T[], useDiastolic: boolean): number | null

    getMaxValue(this: T[], useDiastolic: boolean): number | null

    getAvgValue(this: T[], useDiastolic: boolean): number | null
  }
}

if (!Array.prototype.getMinValue) {
  Array.prototype.getMinValue = function <T extends BloodPressure>(
    this: T[],
    useDiastolic: boolean,
  ): number | null {
    return this.reduce((memo: number | null, current: BloodPressure):
      | number
      | null => {
      const readingValue = Number(
        useDiastolic ? current.diastolic : current.systolic,
      )

      if (!memo) {
        return readingValue
      }

      return memo < readingValue ? memo : readingValue
    }, null)
  }
}

if (!Array.prototype.getMaxValue) {
  Array.prototype.getMaxValue = function <T extends BloodPressure>(
    this: T[],
    useDiastolic: boolean,
  ): number | null {
    return this.reduce((memo: number | null, current: BloodPressure):
      | number
      | null => {
      const readingValue = Number(
        useDiastolic ? current.diastolic : current.systolic,
      )

      if (!memo) {
        return readingValue
      }

      return memo > readingValue ? memo : readingValue
    }, null)
  }
}

if (!Array.prototype.getAvgValue) {
  Array.prototype.getAvgValue = function <T extends BloodPressure>(
    this: T[],
    useDiastolic: boolean,
  ): number | null {
    return (
      this.map((reading) =>
        useDiastolic ? reading.diastolic : reading.systolic,
      ).reduce((acc, cur) => acc + cur) / this.length
    )
  }
}
