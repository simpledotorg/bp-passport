export enum BLOOD_SUGAR_TYPES {
  RANDOM_BLOOD_SUGAR = 'random',
  FASTING_BLOOD_SUGAR = 'fasting',
  POST_PRANDIAL = 'prandial',
  HEMOGLOBIC = 'hemoglobic',
}

export interface BloodSugar {
  blood_sugar_value: string
  blood_sugar_type: string
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
  blood_sugar_unit?: string
}

declare global {
  interface Array<T> {
    getMinReading(this: T[]): T | null

    getMaxReading(this: T[]): T | null
  }
}

if (!Array.prototype.getMinReading) {
  Array.prototype.getMinReading = function <T extends BloodSugar>(
    this: T[],
  ): BloodSugar | null {
    return this.reduce(
      (memo: BloodSugar | null, current: BloodSugar): BloodSugar | null => {
        const readingValue = Number(current.blood_sugar_value)

        if (!memo) {
          return current
        }

        return Number(memo.blood_sugar_value) < readingValue ? memo : current
      },
      null,
    )
  }
}

if (!Array.prototype.getMaxReading) {
  Array.prototype.getMaxReading = function <T extends BloodSugar>(
    this: T[],
  ): BloodSugar | null {
    return this.reduce(
      (memo: BloodSugar | null, current: BloodSugar): BloodSugar | null => {
        const readingValue = Number(current.blood_sugar_value)

        if (!memo) {
          return current
        }

        return Number(memo.blood_sugar_value) > readingValue ? memo : current
      },
      null,
    )
  }
}
