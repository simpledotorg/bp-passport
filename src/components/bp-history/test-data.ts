import {BloodPressure} from '../../redux/blood-pressure/blood-pressure.models'

function randomBloodPressure(
  systolic: number,
  diastolic: number,
  when: string,
): BloodPressure {
  return {
    systolic,
    diastolic,
    recorded_at: when /* 2019-07-08T18:51:27.255Z */,
  }
}

export function getTestData(): BloodPressure[] {
  const readings: BloodPressure[] = []

  readings.push(randomBloodPressure(88, 87, '2019-11-01T08:51:27.255Z'))
  readings.push(randomBloodPressure(91, 179, '2019-11-01T12:51:27.255Z'))
  readings.push(randomBloodPressure(86, 42, '2019-11-01T18:51:27.255Z'))
  readings.push(randomBloodPressure(109, 129, '2019-11-02T08:51:27.255Z'))
  readings.push(randomBloodPressure(155, 152, '2019-11-02T18:51:27.255Z'))
  readings.push(randomBloodPressure(74, 87, '2019-11-03T08:51:27.255Z'))
  readings.push(randomBloodPressure(148, 51, '2019-11-09T08:51:27.255Z'))
  readings.push(randomBloodPressure(154, 61, '2019-11-11T08:51:27.255Z'))
  readings.push(randomBloodPressure(91, 136, '2019-11-11T12:51:27.255Z'))
  readings.push(randomBloodPressure(119, 124, '2019-11-11T18:51:27.255Z'))
  readings.push(randomBloodPressure(84, 54, '2019-11-12T08:51:27.255Z'))
  readings.push(randomBloodPressure(116, 164, '2019-11-12T18:51:27.255Z'))
  readings.push(randomBloodPressure(123, 44, '2019-11-15T18:51:27.255Z'))
  readings.push(randomBloodPressure(100, 84, '2019-11-13T08:51:27.255Z'))
  readings.push(randomBloodPressure(112, 81, '2019-11-20T08:51:27.255Z'))
  readings.push(randomBloodPressure(110, 168, '2019-11-20T12:51:27.255Z'))
  readings.push(randomBloodPressure(83, 125, '2019-11-21T18:51:27.255Z'))
  readings.push(randomBloodPressure(87, 100, '2019-11-22T08:51:27.255Z'))
  readings.push(randomBloodPressure(160, 93, '2019-11-22T12:51:27.255Z'))
  readings.push(randomBloodPressure(98, 175, '2019-11-22T18:51:27.255Z'))

  readings.push(randomBloodPressure(128, 91, '2020-02-01T08:51:27.255Z'))
  readings.push(randomBloodPressure(154, 80, '2020-02-01T12:51:27.255Z'))
  readings.push(randomBloodPressure(125, 89, '2020-02-01T18:51:27.255Z'))
  readings.push(randomBloodPressure(121, 114, '2020-02-02T08:51:27.255Z'))
  readings.push(randomBloodPressure(127, 119, '2020-02-02T18:51:27.255Z'))
  readings.push(randomBloodPressure(100, 56, '2020-02-03T08:51:27.255Z'))
  readings.push(randomBloodPressure(86, 151, '2020-02-09T08:51:27.255Z'))
  readings.push(randomBloodPressure(91, 102, '2020-02-11T08:51:27.255Z'))
  readings.push(randomBloodPressure(83, 129, '2020-02-11T12:51:27.255Z'))
  readings.push(randomBloodPressure(141, 148, '2020-02-11T18:51:27.255Z'))
  readings.push(randomBloodPressure(128, 101, '2020-02-12T08:51:27.255Z'))
  readings.push(randomBloodPressure(90, 127, '2020-02-12T18:51:27.255Z'))
  readings.push(randomBloodPressure(97, 115, '2020-02-15T18:51:27.255Z'))
  readings.push(randomBloodPressure(78, 127, '2020-02-13T08:51:27.255Z'))
  readings.push(randomBloodPressure(157, 109, '2020-02-20T08:51:27.255Z'))
  readings.push(randomBloodPressure(121, 52, '2020-02-20T12:51:27.255Z'))
  readings.push(randomBloodPressure(92, 126, '2020-02-21T18:51:27.255Z'))
  readings.push(randomBloodPressure(92, 73, '2020-02-25T08:51:27.255Z'))
  readings.push(randomBloodPressure(157, 72, '2020-02-28T12:51:27.255Z'))
  readings.push(randomBloodPressure(137, 77, '2020-02-28T18:51:27.255Z'))
  /*
  readings.push(randomBloodPressure(95, 93, '2020-03-02T08:51:27.255Z'))
  readings.push(randomBloodPressure(78, 122, '2020-03-03T12:51:27.255Z'))
  readings.push(randomBloodPressure(90, 114, '2020-03-04T18:51:27.255Z'))
  readings.push(randomBloodPressure(127, 94, '2020-03-07T08:51:27.255Z'))
  readings.push(randomBloodPressure(129, 52, '2020-03-07T18:51:27.255Z'))
  readings.push(randomBloodPressure(73, 127, '2020-03-10T08:51:27.255Z'))
  readings.push(randomBloodPressure(130, 82, '2020-03-10T08:51:27.255Z'))
  readings.push(randomBloodPressure(98, 148, '2020-03-15T08:51:27.255Z'))
  readings.push(randomBloodPressure(93, 124, '2020-03-15T12:51:27.255Z'))
  readings.push(randomBloodPressure(92, 143, '2020-03-16T18:51:27.255Z'))
  readings.push(randomBloodPressure(85, 46, '2020-03-17T08:51:27.255Z'))
  readings.push(randomBloodPressure(133, 104, '2020-03-19T18:51:27.255Z'))
  readings.push(randomBloodPressure(102, 174, '2020-03-20T18:51:27.255Z'))
  readings.push(randomBloodPressure(95, 58, '2020-03-20T08:51:27.255Z'))
  readings.push(randomBloodPressure(74, 157, '2020-03-20T08:51:27.255Z'))
  readings.push(randomBloodPressure(95, 40, '2020-03-23T12:51:27.255Z'))
  readings.push(randomBloodPressure(119, 136, '2020-03-25T18:51:27.255Z'))
  readings.push(randomBloodPressure(87, 180, '2020-03-26T08:51:27.255Z'))
  readings.push(randomBloodPressure(89, 95, '2020-03-29T12:51:27.255Z'))
  readings.push(randomBloodPressure(123, 87, '2020-03-30T18:51:27.255Z'))*/

  /*readings.push(randomBloodPressur(14' '72', '2020-04-01T08:51:27.255Z'))
  readings.push(randomBloodPressure(151, 61, '2020-04-01T12:51:27.255Z'))
  readings.push(randomBloodPressure(117, 151, '2020-04-01T18:51:27.255Z'))
  readings.push(randomBloodPressure(121, 150, '2020-04-02T08:51:27.255Z'))
  readings.push(randomBloodPressure(160, 91, '2020-04-02T18:51:27.255Z'))
  readings.push(randomBloodPressure(104, 123, '2020-04-03T08:51:27.255Z'))
  readings.push(randomBloodPressure(137, 135, '2020-04-09T08:51:27.255Z'))
  readings.push(randomBloodPressure(107, 157, '2020-04-11T08:51:27.255Z'))
  readings.push(randomBloodPressure(126, 162, '2020-04-11T12:51:27.255Z'))
  readings.push(randomBloodPressure(130, 71, '2020-04-11T18:51:27.255Z'))
  readings.push(randomBloodPressure(81, 171, '2020-04-12T08:51:27.255Z'))
  readings.push(randomBloodPressure(160, 49, '2020-04-12T18:51:27.255Z'))
  readings.push(randomBloodPressure(135, 168, '2020-04-15T18:51:27.255Z'))
  readings.push(randomBloodPressure(158, 145, '2020-06-13T08:51:27.255Z'))
  readings.push(randomBloodPressure(115, 171, '2020-04-20T08:51:27.255Z'))
  readings.push(randomBloodPressure(131, 162, '2020-04-20T12:51:27.255Z'))
  readings.push(randomBloodPressure(138, 66, '2020-04-21T18:51:27.255Z'))
  readings.push(randomBloodPressure(145, 53, '2020-04-22T08:51:27.255Z'))
  readings.push(randomBloodPressure(111, 70, '2020-04-22T12:51:27.255Z'))
  readings.push(randomBloodPressure(71, 48, '2020-04-22T18:51:27.255Z'))*/

  /*
  readings.push(randomBloodPressure(148, 174, '2020-05-01T08:51:27.255Z'))
  readings.push(randomBloodPressure(81, 92, '2020-05-01T12:51:27.255Z'))
  readings.push(randomBloodPressure(155, 146, '2020-05-02T18:51:27.255Z'))
  readings.push(randomBloodPressure(132, 110, '2020-05-03T08:51:27.255Z'))
  readings.push(randomBloodPressure(80, 45, '2020-05-05T18:51:27.255Z'))
  readings.push(randomBloodPressure(137, 62, '2020-05-05T08:51:27.255Z'))
  readings.push(randomBloodPressure(81, 91, '2020-05-09T08:51:27.255Z'))
  readings.push(randomBloodPressure(137, 119, '2020-05-10T08:51:27.255Z'))
  readings.push(randomBloodPressure(94, 87, '2020-05-11T12:51:27.255Z'))
  readings.push(randomBloodPressure(131, 167, '2020-05-11T18:51:27.255Z'))
  readings.push(randomBloodPressure(145, 65, '2020-05-13T08:51:27.255Z'))
  readings.push(randomBloodPressure(155, 83, '2020-05-13T18:51:27.255Z'))
  readings.push(randomBloodPressure(153, 56, '2020-05-16T18:51:27.255Z'))
  readings.push(randomBloodPressure(89, 50, '2020-05-19T08:51:27.255Z'))
  readings.push(randomBloodPressure(107, 84, '2020-05-20T08:51:27.255Z'))
  readings.push(randomBloodPressure(98, 113, '2020-05-25T12:51:27.255Z'))
  readings.push(randomBloodPressure(155, 116, '2020-05-26T18:51:27.255Z'))
  readings.push(randomBloodPressure(145, 102, '2020-05-29T08:51:27.255Z'))
  readings.push(randomBloodPressure(141, 40, '2020-05-29T12:51:27.255Z'))
  readings.push(randomBloodPressure(146, 55, '2020-05-31T18:51:27.255Z'))*/

  /*readings.push(randomBloodPressur(10' '76', '2020-06-01T08:51:27.255Z'))
  readings.push(randomBloodPressure(118, 76, '2020-06-01T12:51:27.255Z'))
  readings.push(randomBloodPressure(133, 62, '2020-06-01T18:51:27.255Z'))
  readings.push(randomBloodPressure(117, 84, '2020-06-02T08:51:27.255Z'))
  readings.push(randomBloodPressure(139, 110, '2020-06-02T18:51:27.255Z'))
  readings.push(randomBloodPressure(96, 130, '2020-06-03T08:51:27.255Z'))
  readings.push(randomBloodPressure(74, 60, '2020-06-09T08:51:27.255Z'))
  readings.push(randomBloodPressure(120, 135, '2020-06-11T08:51:27.255Z'))
  readings.push(randomBloodPressure(82, 118, '2020-06-11T12:51:27.255Z'))
  readings.push(randomBloodPressure(125, 99, '2020-06-11T18:51:27.255Z'))
  readings.push(randomBloodPressure(155, 167, '2020-06-12T08:51:27.255Z'))
  readings.push(randomBloodPressure(123, 101, '2020-06-12T18:51:27.255Z'))
  readings.push(randomBloodPressure(122, 53, '2020-06-15T18:51:27.255Z'))
  readings.push(randomBloodPressure(90, 46, '2020-06-13T08:51:27.255Z'))
  readings.push(randomBloodPressure(144, 91, '2020-06-20T08:51:27.255Z'))
  readings.push(randomBloodPressure(86, 111, '2020-06-20T12:51:27.255Z'))
  readings.push(randomBloodPressure(70, 100, '2020-06-21T18:51:27.255Z'))
  readings.push(randomBloodPressure(71, 68, '2020-06-22T08:51:27.255Z'))
  readings.push(randomBloodPressure(148, 48, '2020-06-22T12:51:27.255Z'))
  readings.push(randomBloodPressure(139, 179, '2020-06-22T18:51:27.255Z'))*/

  return readings
}
