import {DateRange} from '../../utils/dates'

export class ChartData {
  dates: DateRange[]
  low: DateRange[]
  high: DateRange[]
  min: null | number
  max: null | number
}
