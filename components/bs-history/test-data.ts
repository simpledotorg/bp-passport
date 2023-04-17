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

function Hemoglobic(value: string, when: string): BloodSugar {
  return {
    blood_sugar_value: value,
    blood_sugar_type: BLOOD_SUGAR_TYPES.HEMOGLOBIC,
    recorded_at: when,
  }
}

export function getTestData(): BloodSugar[] {
  const readings: BloodSugar[] = []

  readings.push(randomBloodSugar('175', '2019-11-01T08:51:27.255Z'))
  readings.push(randomBloodSugar('135', '2019-11-01T12:51:27.255Z'))
  readings.push(randomBloodSugar('250', '2019-11-01T18:51:27.255Z'))
  readings.push(randomBloodSugar('150', '2019-11-02T08:51:27.255Z'))
  readings.push(randomBloodSugar('200', '2019-11-02T18:51:27.255Z'))
  readings.push(randomBloodSugar('110', '2019-11-03T08:51:27.255Z'))
  readings.push(randomBloodSugar('60', '2019-11-09T08:51:27.255Z'))
  readings.push(randomBloodSugar('169', '2019-11-11T08:51:27.255Z'))
  readings.push(randomBloodSugar('159', '2019-11-11T12:51:27.255Z'))
  readings.push(randomBloodSugar('90', '2019-11-11T18:51:27.255Z'))
  readings.push(randomBloodSugar('80', '2019-11-12T08:51:27.255Z'))
  readings.push(randomBloodSugar('70', '2019-11-12T18:51:27.255Z'))
  readings.push(randomBloodSugar('300', '2019-11-15T18:51:27.255Z'))
  readings.push(randomBloodSugar('160', '2019-11-13T08:51:27.255Z'))
  readings.push(randomBloodSugar('70', '2019-11-20T08:51:27.255Z'))
  readings.push(randomBloodSugar('80', '2019-11-20T12:51:27.255Z'))
  readings.push(randomBloodSugar('200', '2019-11-21T18:51:27.255Z'))
  readings.push(randomBloodSugar('125', '2019-11-22T08:51:27.255Z'))
  readings.push(randomBloodSugar('115', '2019-11-22T12:51:27.255Z'))
  readings.push(randomBloodSugar('90', '2019-11-22T18:51:27.255Z'))

  readings.push(randomBloodSugar('250', '2020-02-01T08:51:27.255Z'))
  readings.push(randomBloodSugar('190', '2020-02-01T12:51:27.255Z'))
  readings.push(randomBloodSugar('180', '2020-02-01T18:51:27.255Z'))
  readings.push(randomBloodSugar('175', '2020-02-02T08:51:27.255Z'))
  readings.push(randomBloodSugar('160', '2020-02-02T18:51:27.255Z'))
  readings.push(randomBloodSugar('110', '2020-02-03T08:51:27.255Z'))
  readings.push(randomBloodSugar('120', '2020-02-09T08:51:27.255Z'))
  readings.push(randomBloodSugar('115', '2020-02-11T08:51:27.255Z'))
  readings.push(randomBloodSugar('150', '2020-02-11T12:51:27.255Z'))
  readings.push(randomBloodSugar('190', '2020-02-11T18:51:27.255Z'))
  readings.push(randomBloodSugar('180', '2020-02-12T08:51:27.255Z'))
  readings.push(randomBloodSugar('130', '2020-02-12T18:51:27.255Z'))
  readings.push(randomBloodSugar('60', '2020-02-15T18:51:27.255Z'))
  readings.push(randomBloodSugar('70', '2020-02-13T08:51:27.255Z'))
  readings.push(randomBloodSugar('170', '2020-02-20T08:51:27.255Z'))
  readings.push(randomBloodSugar('120', '2020-02-20T12:51:27.255Z'))
  readings.push(randomBloodSugar('220', '2020-02-21T18:51:27.255Z'))
  readings.push(randomBloodSugar('230', '2020-02-25T08:51:27.255Z'))
  readings.push(randomBloodSugar('150', '2020-02-28T12:51:27.255Z'))
  readings.push(randomBloodSugar('135', '2020-02-28T18:51:27.255Z'))
  /*
  readings.push(randomBloodSugar('110', '2020-03-02T08:51:27.255Z'))
  readings.push(randomBloodSugar('100', '2020-03-03T12:51:27.255Z'))
  readings.push(randomBloodSugar('85', '2020-03-04T18:51:27.255Z'))
  readings.push(randomBloodSugar('70', '2020-03-07T08:51:27.255Z'))
  readings.push(randomBloodSugar('60', '2020-03-07T18:51:27.255Z'))
  readings.push(randomBloodSugar('50', '2020-03-10T08:51:27.255Z'))
  readings.push(randomBloodSugar('60', '2020-03-10T08:51:27.255Z'))
  readings.push(randomBloodSugar('70', '2020-03-15T08:51:27.255Z'))
  readings.push(randomBloodSugar('100', '2020-03-15T12:51:27.255Z'))
  readings.push(randomBloodSugar('100', '2020-03-16T18:51:27.255Z'))
  readings.push(randomBloodSugar('100', '2020-03-17T08:51:27.255Z'))
  readings.push(randomBloodSugar('120', '2020-03-19T18:51:27.255Z'))
  readings.push(randomBloodSugar('170', '2020-03-20T18:51:27.255Z'))
  readings.push(randomBloodSugar('160', '2020-03-20T08:51:27.255Z'))
  readings.push(randomBloodSugar('180', '2020-03-20T08:51:27.255Z'))
  readings.push(randomBloodSugar('170', '2020-03-23T12:51:27.255Z'))
  readings.push(randomBloodSugar('200', '2020-03-25T18:51:27.255Z'))
  readings.push(randomBloodSugar('119', '2020-03-26T08:51:27.255Z'))
  readings.push(randomBloodSugar('110', '2020-03-29T12:51:27.255Z'))
  readings.push(randomBloodSugar('100', '2020-03-30T18:51:27.255Z'))*/

  /*readings.push(randomBloodSugar('110', '2020-04-01T08:51:27.255Z'))
  readings.push(randomBloodSugar('120', '2020-04-01T12:51:27.255Z'))
  readings.push(randomBloodSugar('125', '2020-04-01T18:51:27.255Z'))
  readings.push(randomBloodSugar('130', '2020-04-02T08:51:27.255Z'))
  readings.push(randomBloodSugar('150', '2020-04-02T18:51:27.255Z'))
  readings.push(randomBloodSugar('150', '2020-04-03T08:51:27.255Z'))
  readings.push(randomBloodSugar('60', '2020-04-09T08:51:27.255Z'))
  readings.push(randomBloodSugar('200', '2020-04-11T08:51:27.255Z'))
  readings.push(randomBloodSugar('250', '2020-04-11T12:51:27.255Z'))
  readings.push(randomBloodSugar('300', '2020-04-11T18:51:27.255Z'))
  readings.push(randomBloodSugar('300', '2020-04-12T08:51:27.255Z'))
  readings.push(randomBloodSugar('250', '2020-04-12T18:51:27.255Z'))
  readings.push(randomBloodSugar('225', '2020-04-15T18:51:27.255Z'))
  readings.push(randomBloodSugar('200', '2020-06-13T08:51:27.255Z'))
  readings.push(randomBloodSugar('170', '2020-04-20T08:51:27.255Z'))
  readings.push(randomBloodSugar('180', '2020-04-20T12:51:27.255Z'))
  readings.push(randomBloodSugar('200', '2020-04-21T18:51:27.255Z'))
  readings.push(randomBloodSugar('105', '2020-04-22T08:51:27.255Z'))
  readings.push(randomBloodSugar('175', '2020-04-22T12:51:27.255Z'))
  readings.push(randomBloodSugar('150', '2020-04-22T18:51:27.255Z'))*/

  /*
  readings.push(randomBloodSugar('300', '2020-05-01T08:51:27.255Z'))
  readings.push(randomBloodSugar('200', '2020-05-01T12:51:27.255Z'))
  readings.push(randomBloodSugar('175', '2020-05-02T18:51:27.255Z'))
  readings.push(randomBloodSugar('150', '2020-05-03T08:51:27.255Z'))
  readings.push(randomBloodSugar('170', '2020-05-05T18:51:27.255Z'))
  readings.push(randomBloodSugar('90', '2020-05-05T08:51:27.255Z'))
  readings.push(randomBloodSugar('60', '2020-05-09T08:51:27.255Z'))
  readings.push(randomBloodSugar('125', '2020-05-10T08:51:27.255Z'))
  readings.push(randomBloodSugar('135', '2020-05-11T12:51:27.255Z'))
  readings.push(randomBloodSugar('135', '2020-05-11T18:51:27.255Z'))
  readings.push(randomBloodSugar('135', '2020-05-13T08:51:27.255Z'))
  readings.push(randomBloodSugar('140', '2020-05-13T18:51:27.255Z'))
  readings.push(randomBloodSugar('150', '2020-05-16T18:51:27.255Z'))
  readings.push(randomBloodSugar('160', '2020-05-19T08:51:27.255Z'))
  readings.push(randomBloodSugar('70', '2020-05-20T08:51:27.255Z'))
  readings.push(randomBloodSugar('200', '2020-05-25T12:51:27.255Z'))
  readings.push(randomBloodSugar('250', '2020-05-26T18:51:27.255Z'))
  readings.push(randomBloodSugar('300', '2020-05-29T08:51:27.255Z'))
  readings.push(randomBloodSugar('350', '2020-05-29T12:51:27.255Z'))
  readings.push(randomBloodSugar('200', '2020-05-31T18:51:27.255Z'))*/

  /*readings.push(randomBloodSugar('175', '2020-06-01T08:51:27.255Z'))
  readings.push(randomBloodSugar('135', '2020-06-01T12:51:27.255Z'))
  readings.push(randomBloodSugar('250', '2020-06-01T18:51:27.255Z'))
  readings.push(randomBloodSugar('150', '2020-06-02T08:51:27.255Z'))
  readings.push(randomBloodSugar('200', '2020-06-02T18:51:27.255Z'))
  readings.push(randomBloodSugar('110', '2020-06-03T08:51:27.255Z'))
  readings.push(randomBloodSugar('60', '2020-06-09T08:51:27.255Z'))
  readings.push(randomBloodSugar('169', '2020-06-11T08:51:27.255Z'))
  readings.push(randomBloodSugar('159', '2020-06-11T12:51:27.255Z'))
  readings.push(randomBloodSugar('90', '2020-06-11T18:51:27.255Z'))
  readings.push(randomBloodSugar('80', '2020-06-12T08:51:27.255Z'))
  readings.push(randomBloodSugar('70', '2020-06-12T18:51:27.255Z'))
  readings.push(randomBloodSugar('300', '2020-06-15T18:51:27.255Z'))
  readings.push(randomBloodSugar('160', '2020-06-13T08:51:27.255Z'))
  readings.push(randomBloodSugar('70', '2020-06-20T08:51:27.255Z'))
  readings.push(randomBloodSugar('80', '2020-06-20T12:51:27.255Z'))
  readings.push(randomBloodSugar('200', '2020-06-21T18:51:27.255Z'))
  readings.push(randomBloodSugar('125', '2020-06-22T08:51:27.255Z'))
  readings.push(randomBloodSugar('115', '2020-06-22T12:51:27.255Z'))
  readings.push(randomBloodSugar('90', '2020-06-22T18:51:27.255Z'))*/

  readings.push(Hemoglobic('7', '2020-02-01T08:51:27.255Z'))
  readings.push(Hemoglobic('10', '2020-02-05T08:51:27.255Z'))
  readings.push(Hemoglobic('9', '2020-02-06T08:51:27.255Z'))
  readings.push(Hemoglobic('5', '2020-02-10T08:51:27.255Z'))
  readings.push(Hemoglobic('6', '2020-02-11T08:51:27.255Z'))
  readings.push(Hemoglobic('7', '2020-02-13T08:51:27.255Z'))
  readings.push(Hemoglobic('8', '2020-02-14T08:51:27.255Z'))
  readings.push(Hemoglobic('8', '2020-02-20T08:51:27.255Z'))

  readings.push(Hemoglobic('6', '2020-03-04T08:51:27.255Z'))
  readings.push(Hemoglobic('6', '2020-03-05T08:51:27.255Z'))
  readings.push(Hemoglobic('9', '2020-03-06T08:51:27.255Z'))
  readings.push(Hemoglobic('10', '2020-03-11T08:51:27.255Z'))
  readings.push(Hemoglobic('12', '2020-03-13T08:51:27.255Z'))
  readings.push(Hemoglobic('10', '2020-03-20T08:51:27.255Z'))
  readings.push(Hemoglobic('5', '2020-03-28T08:51:27.255Z'))

  readings.push(Hemoglobic('7', '2020-05-01T08:51:27.255Z'))
  readings.push(Hemoglobic('6', '2020-05-10T08:51:27.255Z'))
  readings.push(Hemoglobic('6', '2020-05-20T08:51:27.255Z'))
  readings.push(Hemoglobic('9', '2020-05-21T08:51:27.255Z'))
  readings.push(Hemoglobic('8', '2020-05-25T08:51:27.255Z'))
  readings.push(Hemoglobic('6', '2020-05-26T08:51:27.255Z'))
  readings.push(Hemoglobic('10', '2020-05-28T08:51:27.255Z'))
  readings.push(Hemoglobic('20', '2020-05-30T08:51:27.255Z'))
  readings.push(Hemoglobic('11', '2020-05-31T08:51:27.255Z'))

  readings.push(Hemoglobic('6', '2019-03-04T08:51:27.255Z'))
  readings.push(Hemoglobic('6', '2019-03-05T08:51:27.255Z'))
  readings.push(Hemoglobic('9', '2019-03-06T08:51:27.255Z'))
  readings.push(Hemoglobic('10', '2019-03-11T08:51:27.255Z'))
  readings.push(Hemoglobic('12', '2019-03-13T08:51:27.255Z'))
  readings.push(Hemoglobic('10', '2019-03-20T08:51:27.255Z'))
  readings.push(Hemoglobic('5', '2019-03-28T08:51:27.255Z'))
  readings.push(Hemoglobic('9', '2019-03-30T08:51:27.255Z'))

  return readings
}
