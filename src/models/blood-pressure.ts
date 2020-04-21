export interface BloodPressure {
  diastolic: number
  systolic: number
  facility?: {
    country: string
    district: string
    name: string
    pin: string
    state: string
    street_address: string
    village_or_colony: string
  }
  recorded_at?: string /* 2019-07-08T18:51:27.255Z */
  offline?: boolean
}

/*
"diastolic" : 90,
            "facility" : {
               "country" : "India",
               "district" : "Majuli",
               "name" : "DH Malkharoda",
               "pin" : "936166",
               "state" : "Maharashtra",
               "street_address" : "Gr Floor, Plot No 260, Mehar Bldg, Sector 28, Vashi",
               "village_or_colony" : "Malkharoda"
            },
            "recorded_at" : "2019-07-08T18:51:27.255Z",
            "systolic" : 140 */
