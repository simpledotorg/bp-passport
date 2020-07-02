export enum BLOOD_SUGAR_TYPES {
  RANDOM_BLOOD_SUGAR = 'random', // legacy, now becomes AFTER_EATING
  FASTING_BLOOD_SUGAR = 'fasting', // legacy, now becomes BEFORE_EATING
  POST_PRANDIAL = 'prandial', // legacy, now becomes AFTER_EATING
  HEMOGLOBIC = 'hemoglobic',
  BEFORE_EATING = 'before_eating',
  AFTER_EATING = 'after_eating',
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
