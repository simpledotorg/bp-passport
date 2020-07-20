import {BLOOD_SUGAR_TYPES} from '../../redux/blood-sugar/blood-sugar.models'
import {IDefineChartsAvailable} from './i-define-charts-available'
import {RequestSingleMonthChart} from './request-single-month-chart'
import {RequestHemoglobicChart} from './request-hemoglobic-chart'
import {BloodSugarCode} from '../../utils/blood-sugars'
import ConvertedBloodSugarReading from '../../models/converted_blood_sugar_reading'

export interface IDefineAChartRequest extends IDefineChartsAvailable {
  readonly chartType: BLOOD_SUGAR_TYPES
  changeRequestedType(
    requestedType: BLOOD_SUGAR_TYPES,
    readings: ConvertedBloodSugarReading[],
    displayUnits: BloodSugarCode,
  ): IDefineAChartRequest

  withUpdatedReadings(
    readings: ConvertedBloodSugarReading[],
  ): IDefineAChartRequest

  moveToNextPeriod(): IDefineAChartRequest

  moveToPreviousPeriod(): IDefineAChartRequest

  readonly readings: ConvertedBloodSugarReading[]
}

export const getStartingChartRequest = (
  readings: ConvertedBloodSugarReading[],
  displayUnits: BloodSugarCode,
): IDefineAChartRequest => {
  if (
    readings.hasReadingType(BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR) ||
    readings.hasReadingType(BLOOD_SUGAR_TYPES.POST_PRANDIAL) ||
    readings.hasReadingType(BLOOD_SUGAR_TYPES.AFTER_EATING)
  ) {
    return RequestSingleMonthChart.ForRequestedType(
      BLOOD_SUGAR_TYPES.AFTER_EATING,
      readings,
      displayUnits,
    )
  }

  if (
    readings.hasReadingType(BLOOD_SUGAR_TYPES.BEFORE_EATING) ||
    readings.hasReadingType(BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR)
  ) {
    return RequestSingleMonthChart.ForRequestedType(
      BLOOD_SUGAR_TYPES.BEFORE_EATING,
      readings,
      displayUnits,
    )
  }

  if (
    readings.hasReadingType(BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR) ||
    readings.hasReadingType(BLOOD_SUGAR_TYPES.POST_PRANDIAL) ||
    readings.hasReadingType(BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR)
  ) {
    return RequestSingleMonthChart.ForRequestedType(
      BLOOD_SUGAR_TYPES.AFTER_EATING,
      readings,
      displayUnits,
    )
  }

  if (readings.hasReadingType(BLOOD_SUGAR_TYPES.HEMOGLOBIC)) {
    return RequestHemoglobicChart.StartingState(readings)
  }

  return RequestSingleMonthChart.ForRequestedType(
    BLOOD_SUGAR_TYPES.AFTER_EATING,
    readings,
    displayUnits,
  )
}

export const filterReadings = (
  chartRequest: IDefineAChartRequest,
): BloodSugar[] => {
  if (chartRequest instanceof RequestHemoglobicChart) {
    return chartRequest.readings
      .filterByTypes([BLOOD_SUGAR_TYPES.HEMOGLOBIC])
      .filterForYear(chartRequest.yearToDisplay)
  }
  if (chartRequest instanceof RequestSingleMonthChart) {
    switch (chartRequest.chartType) {
      case BLOOD_SUGAR_TYPES.BEFORE_EATING:
      case BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR:
        return chartRequest.readings
          .filterByTypes([
            BLOOD_SUGAR_TYPES.BEFORE_EATING,
            BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR,
          ])
          .filterForMonthAndYear(
            chartRequest.requestedMonth,
            chartRequest.requestedYear,
          )
      case BLOOD_SUGAR_TYPES.AFTER_EATING:
      case BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR:
      case BLOOD_SUGAR_TYPES.POST_PRANDIAL:
        return chartRequest.readings
          .filterByTypes([
            BLOOD_SUGAR_TYPES.AFTER_EATING,
            BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR,
            BLOOD_SUGAR_TYPES.POST_PRANDIAL,
          ])
          .filterForMonthAndYear(
            chartRequest.requestedMonth,
            chartRequest.requestedYear,
          )

      default:
        throw new Error('Requested blood sugar type not handled')
    }
  }

  throw new Error('Requested chart type not handled')
}

export const determineIfHasPreviousPeriod = (
  requestedChart: IDefineAChartRequest,
): boolean => {
  const oldestReading = requestedChart.readings
    .filterByType(requestedChart.chartType)
    .oldest()
  if (oldestReading === null) {
    return false
  }

  const dateOfOldestReading = new Date(oldestReading.recorded_at)

  if (requestedChart instanceof RequestSingleMonthChart) {
    if (requestedChart.requestedYear < dateOfOldestReading.getFullYear()) {
      return false
    }
    if (requestedChart.requestedYear > dateOfOldestReading.getFullYear()) {
      return true
    }

    return requestedChart.requestedMonth > dateOfOldestReading.getMonth()
  } else if (requestedChart instanceof RequestHemoglobicChart) {
    return dateOfOldestReading.getFullYear() < requestedChart.yearToDisplay
  } else {
    throw new Error('Chart type is not handled')
  }
}

export const determineIfHasNextPeriod = (
  requestedChart: IDefineAChartRequest,
): boolean => {
  const mostRecentReading = requestedChart.readings
    .filterByType(requestedChart.chartType)
    .mostRecent()
  if (mostRecentReading === null) {
    return false
  }

  const dateOfMostRecentReading = new Date(mostRecentReading.recorded_at)

  if (requestedChart instanceof RequestSingleMonthChart) {
    if (requestedChart.requestedYear > dateOfMostRecentReading.getFullYear()) {
      return false
    }
    if (requestedChart.requestedYear < dateOfMostRecentReading.getFullYear()) {
      return true
    }

    return requestedChart.requestedMonth < dateOfMostRecentReading.getMonth()
  } else if (requestedChart instanceof RequestHemoglobicChart) {
    return dateOfMostRecentReading.getFullYear() > requestedChart.yearToDisplay
  } else {
    throw new Error('Chart type is not handled')
  }
}
