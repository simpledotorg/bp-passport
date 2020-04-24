export enum BLOOD_SUGAR_TYPES {
  RANDOM_BLOOD_SUGAR = 'random',
  FASTING_BLOOD_SUGAR = 'fasting',
  POST_PENIAL = 'penial',
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
}
