import React, {useState, useEffect} from 'react'
import {View, Dimensions} from 'react-native'
import {FormattedMessage} from 'react-intl'
import {
  VictoryChart,
  VictoryTheme,
  VictoryLine,
  VictoryScatter,
  VictoryAxis,
  VictoryBar,
} from 'victory-native'

import {BloodPressure} from '../redux/blood-pressure/blood-pressure.models'
import {colors} from '../styles'

interface BloodPressureChartPoint extends BloodPressure {
  index: number
}

type Props = {
  bps: BloodPressure[]
}

export const BpHistoryChart = ({bps}: Props) => {
  const [highBps, setHighBps] = useState<BloodPressureChartPoint[]>([])
  const [lowBps, setLowBps] = useState<BloodPressureChartPoint[]>([])

  const isBloodPressureHigh = (bpIn: BloodPressure) => {
    // A “High BP” is a BP whose Systolic value is greater than or equal to 140 or whose
    // Diastolic value is greater than or equal to 90. All other BPs are “Normal BP”.
    return bpIn.systolic >= 140 || bpIn.diastolic >= 90
  }

  useEffect(() => {
    const reduction = bps.reduce(
      (
        memo: {high: BloodPressureChartPoint[]; low: BloodPressureChartPoint[]},
        current,
        index,
      ) => {
        if (isBloodPressureHigh(current)) {
          memo.high.push({...current, index})
        } else {
          memo.low.push({...current, index})
        }
        return memo
      },
      {high: [], low: []},
    )

    setHighBps(reduction.high)
    setLowBps(reduction.low)
  }, [bps])

  return (
    <View
      style={{
        height: 260,
        borderColor: colors.grey3,
        borderLeftWidth: 1,
        borderTopWidth: 1,
      }}>
      <VictoryChart
        width={Dimensions.get('window').width - 0}
        height={300}
        style={{
          parent: {
            position: 'relative',
            left: -40,
            top: -18,
          },
        }}
        scale={{x: 'linear'}}
        theme={VictoryTheme.material}>
        <VictoryAxis
          tickCount={bps.length > 5 ? bps.length / 2 : bps.length}
          tickValues={bps.map((bp) => `${bp.systolic}/${bp.diastolic}`)}
          style={{
            grid: {stroke: colors.grey3, strokeDasharray: 8},
            axis: {stroke: colors.grey3, opacity: 0},
            ticks: {opacity: 0},
          }}
          invertAxis
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

        {/* <VictoryBar
          data={bps.map((bp, index) => {
            return {x: index + 1, y: bp.systolic, y0: bp.diastolic}
          })}
          style={{
            data: {
              fill: colors.red1,
              width: 8,
            },
          }}
        />

        <VictoryBar
          data={bps.map((bp, index) => {
            if (isBloodPressureHigh(bp)) {
              return null
            }
            return {x: index + 1, y: bp.systolic, y0: bp.diastolic}
          })}
          style={{
            data: {
              fill: colors.green1,
              width: 8,
            },
          }}
        />

        <VictoryScatter
          data={highBps.map((bp) => {
            return {x: bp.index + 1, y: bp.diastolic}
          })}
          size={3}
          style={{
            data: {fill: colors.red1, stroke: colors.red1, strokeWidth: 2},
          }}
        />
        <VictoryScatter
          data={highBps.map((bp) => {
            return {x: bp.index + 1, y: bp.systolic}
          })}
          size={3}
          style={{
            data: {fill: colors.red1, stroke: colors.red1, strokeWidth: 2},
          }}
        />

        <VictoryScatter
          data={lowBps.map((bp) => {
            return {x: bp.index + 1, y: bp.diastolic}
          })}
          size={3}
          style={{
            data: {fill: colors.green1, stroke: colors.green1, strokeWidth: 2},
          }}
        />
        <VictoryScatter
          data={lowBps.map((bp) => {
            return {x: bp.index + 1, y: bp.systolic}
          })}
          size={3}
          style={{
            data: {fill: colors.green1, stroke: colors.green1, strokeWidth: 2},
          }}
        /> */}

        <VictoryLine
          data={bps.map((bp, index) => {
            return {x: index + 1, y: bp.diastolic}
          })}
          style={{
            data: {
              stroke: colors.green1,
            },
          }}
        />
        <VictoryLine
          data={bps.map((bp, index) => {
            return {x: index + 1, y: bp.systolic}
          })}
          style={{
            data: {
              stroke: colors.green1,
            },
          }}
        />
        <VictoryLine
          data={bps.map((bp, index) => {
            const previousBp = bps[index - 1]
            if (
              (previousBp && isBloodPressureHigh(previousBp)) ||
              isBloodPressureHigh(bp)
            ) {
              return {x: index + 1, y: bp.diastolic}
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
          data={bps.map((bp, index) => {
            const previousBp = bps[index - 1]
            if (
              (previousBp && isBloodPressureHigh(previousBp)) ||
              isBloodPressureHigh(bp)
            ) {
              return {x: index + 1, y: bp.systolic}
            }
            return null
          })}
          style={{
            data: {
              stroke: colors.red1,
            },
          }}
        />
        <VictoryScatter
          data={highBps.map((bp) => {
            return {x: bp.index + 1, y: bp.diastolic}
          })}
          size={5}
          style={{
            data: {fill: colors.white100, stroke: colors.red1, strokeWidth: 3},
          }}
        />
        <VictoryScatter
          data={highBps.map((bp) => {
            return {x: bp.index + 1, y: bp.systolic}
          })}
          size={5}
          style={{
            data: {fill: colors.white100, stroke: colors.red1, strokeWidth: 3},
          }}
        />
        <VictoryScatter
          data={lowBps.map((bp) => {
            return {x: bp.index + 1, y: bp.diastolic}
          })}
          size={5}
          style={{
            data: {
              fill: colors.white100,
              stroke: colors.green1,
              strokeWidth: 3,
            },
          }}
        />
        <VictoryScatter
          data={lowBps.map((bp) => {
            return {x: bp.index + 1, y: bp.systolic}
          })}
          size={5}
          style={{
            data: {
              fill: colors.white100,
              stroke: colors.green1,
              strokeWidth: 3,
            },
          }}
        />
      </VictoryChart>
    </View>
  )
}
