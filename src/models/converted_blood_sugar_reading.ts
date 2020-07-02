import {
  BloodSugar,
  BLOOD_SUGAR_TYPES,
} from '../redux/blood-sugar/blood-sugar.models'

import {convertBloodSugarReading, BloodSugarCode} from '../utils/blood-sugars'

class ConvertedBloodSugarReading {
  private _bloodSugarValue: number
  private _bloodSugarType: string
  private _recordedAt: string
  private _facility: any | undefined
  private _offline?: boolean
  private _bloodSugarUnit: BloodSugarCode

  constructor(originalReading: BloodSugar, convertTo: BloodSugarCode) {
    this._bloodSugarValue =
      originalReading.blood_sugar_type !== BLOOD_SUGAR_TYPES.HEMOGLOBIC
        ? convertBloodSugarReading(originalReading, convertTo)
        : Number(originalReading.blood_sugar_value)

    this._bloodSugarType = originalReading.blood_sugar_type
    this._recordedAt = originalReading.recorded_at
    this._facility = originalReading.facility
    this._offline = originalReading.offline
    this._bloodSugarUnit = convertTo
  }

  public get value(): number {
    return this._bloodSugarValue
  }

  public get blood_sugar_type(): string {
    return this._bloodSugarType
  }

  public get recorded_at(): string {
    return this._recordedAt
  }

  public get facility(): any | null {
    return this._facility
  }

  public get offline(): boolean | undefined {
    return this._offline
  }

  public get blood_sugar_unit(): BloodSugarCode {
    return this._bloodSugarUnit
  }
}

export default ConvertedBloodSugarReading

declare global {
  interface Array<T> {
    getMinReading(this: T[]): T | null

    getMaxReading(this: T[]): T | null
  }
}

if (!Array.prototype.getMinReading) {
  Array.prototype.getMinReading = function <
    T extends ConvertedBloodSugarReading
  >(this: T[]): ConvertedBloodSugarReading | null {
    return this.reduce(
      (
        memo: ConvertedBloodSugarReading | null,
        current: ConvertedBloodSugarReading,
      ): ConvertedBloodSugarReading | null => {
        if (!memo) {
          return current
        }

        return memo.value < current.value ? memo : current
      },
      null,
    )
  }
}

if (!Array.prototype.getMaxReading) {
  Array.prototype.getMaxReading = function <
    T extends ConvertedBloodSugarReading
  >(this: T[]): ConvertedBloodSugarReading | null {
    return this.reduce(
      (
        memo: ConvertedBloodSugarReading | null,
        current: ConvertedBloodSugarReading,
      ): ConvertedBloodSugarReading | null => {
        if (!memo) {
          return current
        }

        return memo.value > current.value ? memo : current
      },
      null,
    )
  }
}
