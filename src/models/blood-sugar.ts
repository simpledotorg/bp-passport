export enum BLOOD_SUGAR_TYPES {
  RANDOM_BLOOD_SUGAR = 'RANDOM_BLOOD_SUGAR',
  FASTING_BLOOD_SUGAR = 'FASTING_BLOOD_SUGAR',
  POST_PENIAL = 'POST_PENIAL',
  HEMOGLOBIC = 'HEMOGLOBIC',
}

export interface BloodSugar {
  recorded_at?: string
  type: BLOOD_SUGAR_TYPES
  value: number
  facility?: {
    country: string
    district: string
    name: string
    pin: string
    state: string
    street_address: string
    village_or_colony: string
  }
}
