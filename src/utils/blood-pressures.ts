import {BloodPressure} from '../redux/blood-pressure/blood-pressure.models'

export const isBloodPressureHigh = (bp: BloodPressure): boolean => {
  // A “High BP” is a BP whose Systolic value is greater than or equal to 140 or whose
  // Diastolic value is greater than or equal to 90. All other BPs are “Normal BP”.
  return bp.systolic >= 140 || bp.diastolic >= 90
}
