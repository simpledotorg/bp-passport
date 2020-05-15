import React, {useState, useEffect} from 'react'
import {View, Dimensions} from 'react-native'
import {format, addMonths, isWithinInterval} from 'date-fns'
import {
  VictoryChart,
  VictoryTheme,
  VictoryLine,
  VictoryScatter,
  VictoryAxis,
  VictoryTooltip,
} from 'victory-native'

import {BloodPressure} from '../redux/blood-pressure/blood-pressure.models'
import {colors} from '../styles'
import {generateChartData} from '../utils/data-transform'
import {DateRange} from '../utils/dates'

type Props = {
  bps: BloodPressure[]
}

export const BpHistoryChart = ({bps}: Props) => {
  const isBloodPressureHigh = (bpIn: BloodPressure) => {
    // A “High BP” is a BP whose Systolic value is greater than or equal to 140 or whose
    // Diastolic value is greater than or equal to 90. All other BPs are “Normal BP”.
    return bpIn.systolic >= 140 || bpIn.diastolic >= 90
  }

  const [chartData, setChartData] = useState<{
    dates: DateRange[]
    low: DateRange[]
    high: DateRange[]
  } | null>(null)

  const averageList = (value: DateRange) => {
    const valuesAccumulator = value.list.reduce(
      (memo: {diastolic: number; systolic: number}, current: any) => {
        return {
          diastolic: memo.diastolic + current.diastolic,
          systolic: memo.systolic + current.systolic,
        }
      },
      {diastolic: 0, systolic: 0} as BloodPressure,
    )

    return {
      diastolic: valuesAccumulator.diastolic / value.list.length,
      systolic: valuesAccumulator.systolic / value.list.length,
    }
  }

  useEffect(() => {
    setChartData(generateChartData(bps, averageList, isBloodPressureHigh))
  }, [bps])

  const generateScatter = (list: DateRange[]): any[] => {
    return list.flatMap((bp: DateRange) => {
      return [
        {
          x: bp.index,
          y: bp.averaged.diastolic,
          label: `${bp.averaged.systolic}/${bp.averaged.diastolic}`,
        },
        {
          x: bp.index,
          y: bp.averaged.systolic,
          label: `${bp.averaged.systolic}/${bp.averaged.diastolic}`,
        },
      ]
    })
  }

  if (!chartData) {
    return null
  }

  return (
    <View
      style={{
        height: 260,
        borderColor: colors.grey3,
        borderLeftWidth: 1,
        borderTopWidth: 1,
        overflow: 'hidden',
      }}>
      <VictoryChart
        width={Dimensions.get('window').width - 44}
        height={300}
        minDomain={{y: 40}}
        style={{
          parent: {
            position: 'relative',
            left: -24,
            top: -24,
          },
        }}
        scale={{x: 'linear'}}
        theme={VictoryTheme.material}>
        <VictoryAxis
          tickCount={5}
          tickFormat={(tick) => {
            return format(
              addMonths(chartData.dates[0].interval.start, tick / 4),
              'MMM-yy',
            )
          }}
          tickValues={chartData.dates.map((date, index) => index)}
          style={{
            grid: {stroke: colors.grey3, strokeDasharray: 8},
            axis: {stroke: colors.grey3, opacity: 0},
            ticks: {opacity: 0},
          }}
        />
        <VictoryAxis
          orientation="right"
          dependentAxis
          tickValues={[90, 140]}
          style={{
            grid: {stroke: colors.grey2, strokeDasharray: 8},
            axis: {stroke: colors.grey3, strokeWidth: 0},
            ticks: {opacity: 0},
          }}
        />

        <VictoryLine
          data={[...chartData.low, ...chartData.high].map((bp) => {
            if (bp.list.length) {
              return {
                x: bp.index,
                y: bp.averaged.systolic,
              }
            }
            return null
          })}
          style={{
            data: {
              stroke: colors.red1,
            },
          }}
        />

        <VictoryLine
          data={[...chartData.low, ...chartData.high].map((bp) => {
            if (bp.list.length) {
              return {
                x: bp.index,
                y: bp.averaged.diastolic,
              }
            }
            return null
          })}
          style={{
            data: {
              stroke: colors.red1,
            },
          }}
        />

        <VictoryLine
          data={chartData.low.map((bp) => {
            if (bp.list.length) {
              return {
                x: bp.index,
                y: bp.averaged.systolic,
              }
            }
            return null
          })}
          style={{
            data: {
              stroke: colors.green1,
            },
          }}
        />

        <VictoryLine
          data={chartData.low.map((bp) => {
            if (bp.list.length) {
              return {
                x: bp.index,
                y: bp.averaged.diastolic,
              }
            }
            return null
          })}
          style={{
            data: {
              stroke: colors.green1,
            },
          }}
        />

        <VictoryScatter
          data={generateScatter(chartData.low)}
          size={5}
          style={{
            data: {
              fill: colors.white100,
              stroke: colors.green1,
              strokeWidth: 3,
            },
          }}
          labelComponent={<VictoryTooltip renderInPortal={false} />}
        />

        <VictoryScatter
          data={generateScatter(chartData.high)}
          size={5}
          style={{
            data: {
              fill: colors.white100,
              stroke: colors.red1,
              strokeWidth: 3,
            },
          }}
          labelComponent={<VictoryTooltip renderInPortal={false} />}
        />
      </VictoryChart>
    </View>
  )
}
