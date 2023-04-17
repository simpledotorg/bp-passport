import React, { useState, useEffect } from 'react'
import { View, Dimensions } from 'react-native'
import { GraphLoadingPlaceholder } from './bs-history/graph-loading-placeholder'
import {
  VictoryChart,
  VictoryTheme,
  VictoryScatter,
  VictoryAxis,
  VictoryLine,
  VictoryVoronoiContainer,
} from 'victory-native'

import { BLOOD_SUGAR_TYPES } from '../redux/blood-sugar/blood-sugar.models'
import { colors } from '../styles'
import {
  IDefineAChartRequest,
  getStartingChartRequest,
} from './bs-history/i-define-a-chart-request'
import { ChartData } from './bs-history/chart-data'
import { VictoryGraphToolTipHelper } from './victory-chart-parts/victory-graph-tool-tip-helper'
import { DateAxisComponent } from './victory-chart-parts/date-axis-component'

import { TitleBar } from './victory-chart-parts/title-bar'
import { ChartTypeSelection } from './bs-history/chart-type-selection'

import {
  convertBloodSugarValue,
  BloodSugarCode,
  determinePrecision,
  filterByType,
} from '../utils/blood-sugars'

import ConvertedBloodSugarReading from '../models/converted_blood_sugar_reading'

type Props = {
  bloodSugarReadings: ConvertedBloodSugarReading[]
  displayUnits: BloodSugarCode
}

export const BsHistoryChart = ({ bloodSugarReadings, displayUnits }: Props) => {
  const [requestedChart, setRequestedChart] = useState<IDefineAChartRequest>(
    getStartingChartRequest(bloodSugarReadings, displayUnits),
  )
  const [chartData, setChartData] = useState<ChartData | null>(null)

  useEffect(() => {
    setChartData(null)
    const newRequestedChart = getStartingChartRequest(
      bloodSugarReadings,
      displayUnits,
    )
    setRequestedChart(newRequestedChart)
  }, [bloodSugarReadings])

  useEffect(() => {
    const newChartData = new ChartData(requestedChart)
    setChartData(newChartData)
  }, [requestedChart])

  const getMaxThreshhold = (): number => {
    if (!chartData) {
      throw new Error('Unable to get max threshold as chart data is null')
    }

    switch (chartData.getChartType()) {
      case BLOOD_SUGAR_TYPES.BEFORE_EATING:
        return Number(
          convertBloodSugarValue(
            displayUnits,
            BLOOD_SUGAR_TYPES.BEFORE_EATING,
            '126',
            BloodSugarCode.MG_DL,
          ).toFixed(determinePrecision(displayUnits)),
        )
      case BLOOD_SUGAR_TYPES.HEMOGLOBIC:
        return Number(
          convertBloodSugarValue(
            displayUnits,
            BLOOD_SUGAR_TYPES.HEMOGLOBIC,
            '7',
            BloodSugarCode.MG_DL,
          ).toFixed(determinePrecision(displayUnits)),
        )
      default:
        return Number(
          convertBloodSugarValue(
            displayUnits,
            chartData.getChartType(),
            '200',
            BloodSugarCode.MG_DL,
          ).toFixed(determinePrecision(displayUnits)),
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
          ).toFixed(determinePrecision(displayUnits)),
        )
    }
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
    // setChartData(null)
    setRequestedChart(requestedChart.moveToPreviousPeriod())
  }

  const moveNextPeriod = (): void => {
    // setChartData(null)
    setRequestedChart(requestedChart.moveToNextPeriod())
  }

  if (!chartData) {
    return <GraphLoadingPlaceholder chartsAvailable={requestedChart} />
  }

  const minThreshhold = getMinThreshhold()
  const maxThreshhold = getMaxThreshhold()
  const midAxis = []

  let minDomain = 0
  let maxDomain = 300

  const chartType = chartData.getChartType()

  let maxValue = 0
  let minValue = 45

  filterByType(requestedChart.readings, requestedChart.chartType).map((bs) => {
    if (bs.value > maxValue) {
      maxValue = bs.value
    }
    if (bs.value < minValue) {
      minValue = bs.value
    }
  })

  switch (chartType) {
    case BLOOD_SUGAR_TYPES.AFTER_EATING:
      maxDomain = Math.max(maxValue, 300)
      minDomain = Math.min(minValue, 14)
      break
    case BLOOD_SUGAR_TYPES.BEFORE_EATING:
      maxDomain = Math.max(maxValue, 170)
      minDomain = Math.min(minValue, 45)
      break
    case BLOOD_SUGAR_TYPES.HEMOGLOBIC:
      minDomain = 0
      maxDomain = Math.max(maxValue, 16)

      break
    default:
      break
  }

  switch (chartType) {
    case BLOOD_SUGAR_TYPES.AFTER_EATING:
      if (displayUnits === BloodSugarCode.MMOL_L) {
        midAxis.push(7.5)
        midAxis.push(14.7)
      } else {
        midAxis.push(135)
        midAxis.push(265)
      }

      break
    case BLOOD_SUGAR_TYPES.BEFORE_EATING:
      if (displayUnits === BloodSugarCode.MMOL_L) {
        midAxis.push(5.45)
        midAxis.push(8.55)
      } else {
        midAxis.push(98)
        midAxis.push(154)
      }

      break
    default:
      midAxis.push(0)
      midAxis.push(3.5)
      midAxis.push(10.5)
      midAxis.push(14)

      break
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
        }}
      >
        <DateAxisComponent tickValues={chartData.getAxisTickValues()} />
        <VictoryChart
          maxDomain={{
            y: maxDomain,
          }}
          minDomain={{
            y: minDomain,
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
          // scale={{ x: 'linear' }}
          theme={VictoryTheme.material}
          containerComponent={<VictoryVoronoiContainer radius={30} />}
        >
          <VictoryAxis
            tickCount={chartData.getAxisTickValues().length}
            tickFormat={(tick) => {
              return tick
            }}
            tickValues={chartData.getIndexValues()}
            style={{
              grid: { stroke: colors.grey3, strokeDasharray: 4 },
              axis: { stroke: colors.grey3, opacity: 0 },
              ticks: { opacity: 0 },
              tickLabels: { opacity: 0 },
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
            tickValues={[maxThreshhold]}
            style={{
              grid: { stroke: colors.grey1, strokeDasharray: 0 },
              axis: {
                stroke: colors.grey3,
                strokeDasharray: 4,
                strokeWidth: 0,
              },
              ticks: { opacity: 0 },
            }}
          />
          {midAxis.map((data, index) => {
            return (
              <VictoryAxis
                orientation="right"
                dependentAxis
                key={`mid-axis-${index}`}
                tickFormat={(tick) => {
                  if (
                    chartData.getChartType() === BLOOD_SUGAR_TYPES.HEMOGLOBIC
                  ) {
                    return `${tick}%`
                  }
                  return tick
                }}
                tickValues={[data]}
                style={{
                  grid: { opacity: 0 },
                  axis: {
                    opacity: 0,
                  },
                  ticks: { opacity: 0 },
                  tickLabels: {
                    fill: colors.grey2,
                  },
                  axisLabel: { fontSize: 20, padding: 30 },
                }}
              />
            )
          })}

          {minThreshhold && (
            <VictoryAxis
              orientation="right"
              dependentAxis
              tickFormat={(tick) => {
                if (chartData.getChartType() === BLOOD_SUGAR_TYPES.HEMOGLOBIC) {
                  return `${tick}%`
                }
                return tick
              }}
              tickValues={[minThreshhold]}
              style={{
                grid: { stroke: colors.grey1, strokeDasharray: 0 },
                axis: {
                  stroke: colors.grey3,
                  strokeDasharray: 4,
                  strokeWidth: 0,
                },
                ticks: { opacity: 0 },
              }}
            />
          )}
          {!chartData.displayLineGraph &&
            chartData.getMinMaxDataForGraph().map((line) => {
              return (
                <VictoryLine
                  key={line.index}
                  data={[
                    { x: line.index, y: line.max },
                    { x: line.index, y: line.min },
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
            size={({ active }) => (active ? 4 : 3)}
            style={{
              data: {
                fill: ({ datum, active }) =>
                  active
                    ? colors.white
                    : datum.showOutOfRange
                    ? colors.red1
                    : colors.green1,
                stroke: colors.blue2,
                strokeWidth: ({ active }) => (active ? 2 : 0),
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
