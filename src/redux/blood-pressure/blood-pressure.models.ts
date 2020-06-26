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
