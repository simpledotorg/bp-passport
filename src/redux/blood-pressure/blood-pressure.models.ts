export class BloodPressure {
  diastolic: number
  systolic: number
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
    return 90
  }

  static get systolicUpperThreshold(): number {
    return 140
  }
}

export const getMinValue = <T extends BloodPressure>(
  arr: T[],
  useDiastolic: boolean,
): number | null => {
  return arr.reduce((memo: number | null, current: BloodPressure):
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

export const getMaxValue = <T extends BloodPressure>(
  arr: T[],
  useDiastolic: boolean,
): number | null => {
  return arr.reduce((memo: number | null, current: BloodPressure):
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

export const getAvgValue = <T extends BloodPressure>(
  arr: T[],
  useDiastolic: boolean,
): number | null => {
  return (
    arr
      .map(reading => (useDiastolic ? reading.diastolic : reading.systolic))
      .reduce((acc, cur) => acc + cur) / arr.length
  )
}
