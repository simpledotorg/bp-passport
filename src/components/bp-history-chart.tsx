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
import {getChartDateRange} from '../utils/dates'

interface BloodPressureChartPoint {
  interval: {start: Date; end: Date}
  list: BloodPressure[]
  averaged: {diastolic: number; systolic: number}
}

type Props = {
  bps: BloodPressure[]
}

export const BpHistoryChart = ({bps}: Props) => {
  const [highBps, setHighBps] = useState<BloodPressureChartPoint[] | null>(null)
  const [lowBps, setLowBps] = useState<BloodPressureChartPoint[] | null>(null)

  const dates: BloodPressureChartPoint[] = getChartDateRange()

  const isBloodPressureHigh = (bpIn: BloodPressure) => {
    // A “High BP” is a BP whose Systolic value is greater than or equal to 140 or whose
    // Diastolic value is greater than or equal to 90. All other BPs are “Normal BP”.
    return bpIn.systolic >= 140 || bpIn.diastolic >= 90
  }

  const getIndexFromBP = (bp: BloodPressure) => {
    let index = 0

    const found = dates.find((date, i) => {
      index = i
      return isWithinInterval(new Date(bp.recorded_at), date.interval)
    })

    if (found) {
      return index
    } else {
      return 0
    }
  }

  useEffect(() => {
    bps.forEach((bp) => {
      const index = getIndexFromBP(bp)
      if (dates[index]) {
        dates[index].list.push(bp)
      }
    })

    const reduction = dates.reduce(
      (
        memo: {high: BloodPressureChartPoint[]; low: BloodPressureChartPoint[]},
        current,
      ) => {
        if (current.list.length) {
          const valuesAccumulator = current.list.reduce(
            (
              memoAcc: {diastolic: number; systolic: number},
              currentAcc: BloodPressure,
            ) => {
              return {
                diastolic: memoAcc.diastolic + currentAcc.diastolic,
                systolic: memoAcc.systolic + currentAcc.systolic,
              }
            },
            {diastolic: 0, systolic: 0},
          )

          const average: {
            diastolic: number
            systolic: number
          } = {
            diastolic: valuesAccumulator.diastolic / current.list.length,
            systolic: valuesAccumulator.systolic / current.list.length,
          }

          current.averaged = average

          if (isBloodPressureHigh(average as BloodPressure)) {
            memo.high.push({...current, averaged: average})
          } else {
            memo.low.push({...current, averaged: average})
          }
        }
        return memo
      },
      {high: [], low: []},
    )

    setHighBps(reduction.high)
    setLowBps(reduction.low)
  }, [bps])

  const generateScatter = (
    bps: BloodPressureChartPoint[],
  ): BloodPressureChartPoint[] => {
    return bps.flatMap((bp: BloodPressureChartPoint) => {
      const index = getIndexFromBP(bp.list[0])

      return [
        {
          x: index + 1,
          y: bp.averaged.diastolic,
          label: `${bp.averaged.systolic}/${bp.averaged.diastolic}`,
        },
        {
          x: index + 1,
          y: bp.averaged.systolic,
          label: `${bp.averaged.systolic}/${bp.averaged.diastolic}`,
        },
      ]
    })
  }

  if (!highBps || !lowBps) {
    return <></>
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
        width={Dimensions.get('window').width - 24}
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
              addMonths(dates[0].interval.start, tick / 4),
              'MMM-yy',
            )
          }}
          tickValues={dates.map((date, index) => index)}
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
          data={[...lowBps, ...highBps].map((bp) => {
            if (bp.list.length) {
              const index = getIndexFromBP(bp.list[0])

              return {
                x: index + 1,
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
          data={[...lowBps, ...highBps].map((bp) => {
            if (bp.list.length) {
              const index = getIndexFromBP(bp.list[0])

              return {
                x: index + 1,
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
          data={lowBps.map((bp) => {
            if (bp.list.length) {
              const index = getIndexFromBP(bp.list[0])

              return {
                x: index + 1,
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
          data={lowBps.map((bp) => {
            if (bp.list.length) {
              const index = getIndexFromBP(bp.list[0])

              return {
                x: index + 1,
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
          data={generateScatter(lowBps)}
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
          data={generateScatter(highBps)}
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
