import React, {useState, useEffect} from 'react'
import {View, Dimensions} from 'react-native'
import {GraphLoadingPlaceholder} from './bs-history/graph-loading-placeholder'
import {
  VictoryChart,
  VictoryTheme,
  VictoryScatter,
  VictoryAxis,
  VictoryLine,
  VictoryVoronoiContainer,
} from 'victory-native'

import {
  BloodSugar,
  BLOOD_SUGAR_TYPES,
} from '../redux/blood-sugar/blood-sugar.models'
import {colors} from '../styles'
import {
  IDefineAChartRequest,
  getStartingChartRequest,
} from './bs-history/i-define-a-chart-request'
import {ChartData} from './bs-history/chart-data'
import {VictoryGraphToolTipHelper} from './victory-chart-parts/victory-graph-tool-tip-helper'
import {DateAxisComponent} from './victory-chart-parts/date-axis-component'

import {TitleBar} from './victory-chart-parts/title-bar'
import {ChartTypeSelection} from './bs-history/chart-type-selection'

import {convertBloodSugarValue, BloodSugarCode} from '../utils/blood-sugars'

type Props = {
  bloodSugarReadings: BloodSugar[]
  displayUnits: BloodSugarCode
}

export const BsHistoryChart = ({bloodSugarReadings, displayUnits}: Props) => {
  const [requestedChart, setRequestedChart] = useState<IDefineAChartRequest>(
    getStartingChartRequest(bloodSugarReadings, displayUnits),
  )

  const [chartData, setChartData] = useState<ChartData | null>(null)

  useEffect(() => {
    setChartData(null)
    setRequestedChart(
      requestedChart.withUpdatedReadings(bloodSugarReadings) ??
        getStartingChartRequest(bloodSugarReadings, displayUnits),
    )
  }, [bloodSugarReadings])

  useEffect(() => {
    if (requestedChart) {
      setChartData(new ChartData(requestedChart))
    }
  }, [requestedChart])

  const getMaxThreshhold = (): number => {
    if (!chartData) {
      throw new Error('Unable to get max threshold as chart data is null')
    }

    switch (chartData.getChartType()) {
      case BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR:
        return Number(
          convertBloodSugarValue(
            displayUnits,
            chartData.getChartType(),
            '126',
            BloodSugarCode.MG_DL,
          ).toFixed(0),
        )
      case BLOOD_SUGAR_TYPES.HEMOGLOBIC:
        return Number(
          convertBloodSugarValue(
            displayUnits,
            chartData.getChartType(),
            '7',
            BloodSugarCode.MG_DL,
          ).toFixed(0),
        )
      default:
        return Number(
          convertBloodSugarValue(
            displayUnits,
            chartData.getChartType(),
            '200',
            BloodSugarCode.MG_DL,
          ).toFixed(0),
        )
    }
  }

  const getMinThreshhold = (): number | null => {
    if (!chartData) {
      throw new Error('Unable to get min threshold as chart data is null')
    }

    switch (chartData.getChartType()) {
      case BLOOD_SUGAR_TYPES.HEMOGLOBIC:
        return null
      default:
        return Number(
          convertBloodSugarValue(
            displayUnits,
            chartData.getChartType(),
            '70',
            BloodSugarCode.MG_DL,
          ).toFixed(0),
        )
    }
  }

  const getMaxDomain = () => {
    if (!chartData) {
      throw new Error('Can not get max domain, not instance of chart data')
    }

    const threshhold = getMaxThreshhold()
    const difference = Math.round(threshhold / 10)
    let base = chartData.getMaxReading() ?? threshhold

    if (base < threshhold) {
      base = threshhold
    }

    return base + difference
  }

  const getMinDomain = () => {
    if (!chartData) {
      throw new Error('Can not get min domain, not instance of chart data')
    }

    const threshhold = getMinThreshhold() ?? getMaxThreshhold()
    const difference = Math.round(threshhold / 10)
    let base = chartData.getMinReading() ?? threshhold

    if (base > threshhold) {
      base = threshhold
    }

    return base - difference
  }

  const changeChartTypeHandler = (newChartType: BLOOD_SUGAR_TYPES): void => {
    setChartData(null)
    setRequestedChart(
      requestedChart.changeRequestedType(
        newChartType,
        bloodSugarReadings,
        displayUnits,
      ),
    )
  }

  const movePreviousPeriod = (): void => {
    setChartData(null)
    setRequestedChart(requestedChart.moveToPreviousPeriod())
  }

  const moveNextPeriod = (): void => {
    setChartData(null)
    setRequestedChart(requestedChart.moveToNextPeriod())
  }

  if (!chartData) {
    return <GraphLoadingPlaceholder chartsAvailable={requestedChart} />
  }

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
          position: 'relative',
        }}>
        <DateAxisComponent tickValues={chartData.getAxisTickValues()} />
        <VictoryChart
          maxDomain={{
            y: getMaxDomain(),
          }}
          minDomain={{
            y: getMinDomain(),
          }}
          width={Dimensions.get('window').width - 24}
          height={310}
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
            tickFormat={(tick) => {
              if (chartData.getChartType() === BLOOD_SUGAR_TYPES.HEMOGLOBIC) {
                return `${tick}%`
              }
              return tick
            }}
            tickValues={[getMaxThreshhold()]}
            style={{
              grid: {stroke: colors.grey2, strokeDasharray: 4},
              axis: {stroke: colors.grey3, strokeDasharray: 4, strokeWidth: 0},
              ticks: {opacity: 0},
            }}
          />
          {getMinThreshhold() && (
            <VictoryAxis
              orientation="right"
              dependentAxis
              tickFormat={(tick) => {
                if (chartData.getChartType() === BLOOD_SUGAR_TYPES.HEMOGLOBIC) {
                  return `${tick}%`
                }
                return tick
              }}
              tickValues={[getMinThreshhold()]}
              style={{
                grid: {stroke: colors.grey2, strokeDasharray: 4},
                axis: {
                  stroke: colors.grey3,
                  strokeDasharray: 4,
                  strokeWidth: 0,
                },
                ticks: {opacity: 0},
              }}
            />
          )}
          {chartData.getMinMaxDataForGraph().map((line) => {
            return (
              <VictoryLine
                key={line.index}
                data={[
                  {x: line.index, y: line.max},
                  {x: line.index, y: line.min},
                ]}
                style={{
                  data: {
                    stroke: colors.grey4,
                    strokeWidth: 6,
                  },
                }}
              />
            )
          })}
          {chartData.displayLineGraph && (
            <VictoryLine
              data={chartData.getLineGraphData()}
              style={{
                data: {
                  stroke: colors.grey1,
                  strokeWidth: 1,
                },
              }}
            />
          )}

          <VictoryScatter
            data={chartData.getScatterDataForGraph()}
            size={3}
            style={{
              data: {
                fill: ({datum}) =>
                  datum.showOutOfRange ? colors.red1 : colors.green1,
              },
            }}
            labelComponent={VictoryGraphToolTipHelper.getVictoryToolTip()}
          />
        </VictoryChart>
      </View>
      <ChartTypeSelection
        chartTypesAvailable={chartData}
        changeChartTypeHandler={changeChartTypeHandler}
      />
    </>
  )
}
