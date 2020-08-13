import React, {useState, useEffect} from 'react'
import {View, Dimensions} from 'react-native'
import {
  VictoryChart,
  VictoryTheme,
  VictoryLine,
  VictoryScatter,
  VictoryAxis,
  VictoryVoronoiContainer,
} from 'victory-native'

import {BloodPressure} from '../redux/blood-pressure/blood-pressure.models'
import {colors} from '../styles'
import {VictoryGraphToolTipHelper} from './victory-chart-parts/victory-graph-tool-tip-helper'
import {ChartData} from './bp-history/chart-data'
import {GraphLoadingPlaceholder} from './bp-history/graph-loading-placeholder'
import {TitleBar} from './victory-chart-parts/title-bar'
import {ChartRequest} from './bp-history/chart-request'
import {DateAxisComponent} from './victory-chart-parts/date-axis-component'

type Props = {
  bps: BloodPressure[]
}

export const BpHistoryChart = ({bps}: Props) => {
  const [requestedChart, setRequestedChart] = useState<ChartRequest>(
    ChartRequest.CreateFromAvailableReadings(bps),
  )
  const [chartData, setChartData] = useState<ChartData | null>(null)

  useEffect(() => {
    setChartData(null)
    setRequestedChart(
      requestedChart.withUpdatedReadings(bps) ??
        ChartRequest.CreateFromAvailableReadings(bps),
    )
  }, [bps])

  useEffect(() => {
    if (requestedChart) {
      setChartData(new ChartData(requestedChart))
    }
  }, [requestedChart])

  const getMaxDomain = () => {
    if (!chartData) {
      throw new Error('Can not get max domain, not instance of chart data')
    }
    const defaultMax = 190
    return Math.max(defaultMax, chartData.getMaxDataValue() || defaultMax)
  }

  const getMinDomain = () => {
    if (!chartData) {
      throw new Error('Can not get min domain, not instance of chart data')
    }

    const defaultMin = 50
    return Math.min(defaultMin, chartData.getMinDataValue() || defaultMin)
  }

  const movePreviousPeriod = (): void => {
    // setChartData(null)
    setRequestedChart(requestedChart.moveToPreviousPeriod())
  }

  const moveNextPeriod = (): void => {
    // setChartData(null)
    setRequestedChart(requestedChart.moveToNextPeriod())
  }

  if (!chartData) {
    return <GraphLoadingPlaceholder chartTitle={requestedChart.getTitle()} />
  }

  console.log('chartData: ', chartData)

  return (
    <>
      <TitleBar
        chartTitle={chartData.getTitle()}
        hasPreviousPeriod={chartData.hasPreviousPeriod()}
        moveToPreviousPeriodHandler={movePreviousPeriod}
        hasNextPeriod={chartData.hasNextPeriod()}
        moveToNextPeriodHandler={moveNextPeriod}
      />
      <View
        style={{
          height: 260,
          borderColor: colors.grey3,
          borderLeftWidth: 1,
          borderTopWidth: 1,
          overflow: 'visible',
          position: 'relative',
        }}>
        <DateAxisComponent tickValues={chartData.getAxisTickValues()} />

        <VictoryChart
          width={Dimensions.get('window').width - 24}
          height={310}
          maxDomain={{
            y: getMaxDomain(),
          }}
          minDomain={{
            y: getMinDomain(),
          }}
          style={{
            parent: {
              position: 'relative',
              left: -44,
              top: -44,
            },
          }}
          scale={{x: 'linear'}}
          theme={VictoryTheme.material}
          containerComponent={<VictoryVoronoiContainer radius={30} />}>
          <VictoryAxis
            tickCount={chartData.getAxisTickValues().length}
            tickFormat={(tick) => {
              return tick
            }}
            tickValues={chartData.getIndexValues()}
            style={{
              grid: {stroke: colors.grey3, strokeDasharray: 4},
              axis: {stroke: colors.grey3, opacity: 0},
              ticks: {opacity: 0},
              tickLabels: {opacity: 0},
            }}
          />
          <VictoryAxis
            orientation="right"
            dependentAxis
            tickValues={[90, 140]}
            style={{
              grid: {stroke: colors.grey1, strokeDasharray: 0},
              axis: {stroke: colors.grey3, strokeDasharray: 4, strokeWidth: 0},
              ticks: {opacity: 0},
            }}
          />
          <VictoryLine
            data={chartData.getLineGraph(true)}
            style={{
              data: {
                stroke: colors.grey1,
                strokeWidth: 1,
              },
            }}
          />
          <VictoryLine
            data={chartData.getLineGraph(false)}
            style={{
              data: {
                stroke: colors.grey1,
                strokeWidth: 1,
              },
            }}
          />
          <VictoryScatter
            labelComponent={VictoryGraphToolTipHelper.getVictoryToolTip()}
            data={chartData.getScatterDataForGraph()}
            size={({active}) => (active ? 4 : 3)}
            style={{
              data: {
                fill: ({datum, active}) =>
                  active
                    ? colors.white
                    : datum.showOutOfRange
                    ? colors.red1
                    : colors.green1,
                stroke: colors.blue2,
                strokeWidth: ({active}) => (active ? 2 : 0),
              },
            }}
          />
        </VictoryChart>
      </View>
    </>
  )
}
