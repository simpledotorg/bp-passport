import {
  BloodSugar,
  BLOOD_SUGAR_TYPES,
} from '../../redux/blood-sugar/blood-sugar.models'

function randomBloodSugar(value: string, when: string): BloodSugar {
  return {
    blood_sugar_value: value,
    blood_sugar_type: BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR,
    recorded_at: when,
  }
}

export function getTestData(): BloodSugar[] {
  const readings: BloodSugar[] = []

  readings.push(randomBloodSugar('50', '2020-05-08T18:51:27.255Z'))

  readings.push(randomBloodSugar('110', '2020-06-22T08:51:27.255Z'))
  readings.push(randomBloodSugar('120', '2020-06-22T12:51:27.255Z'))
  readings.push(randomBloodSugar('200', '2020-06-22T18:51:27.255Z'))

  return readings
}
