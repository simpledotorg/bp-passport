import React, {useState, useEffect} from 'react'
import {View, Dimensions} from 'react-native'
import {useIntl} from 'react-intl'
import {GraphLoadingPlaceholder} from './victory-chart-parts/graph-loading-placeholder'
import {EmptyYLeftAxis} from './victory-chart-parts/empty-y-left-axis'

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
import {IDefineAChartRequest} from './bs-history/i-define-a-chart-request'
import {RequestSingleMonthChart} from './bs-history/request-single-month-chart'
import {RequestHemoglobicChart} from './bs-history/request-hemoglobic-chart'
import {ChartData} from './bs-history/chart-data'
import {ChartTypeSelectionPill} from './bs-history/chart-type-selection-pill'
import {VictoryGraphToolTipHelper} from './victory-chart-parts/victory-graph-tool-tip-helper'
import {DayOfMonthAxisLabel} from './victory-chart-parts/day-of-month-axis-label'
import {MonthNameAxisLabel} from './victory-chart-parts/month-name-axis-label'
import {MonthInitialAxisLabel} from './victory-chart-parts/month-initial-axis-label'
import {MonthAndYearLabel} from './victory-chart-parts/month-and-year-label'
import {MonthInitialLabel} from './victory-chart-parts/month-initial-label'
import {DayOfMonthLabel} from './victory-chart-parts/day-of-month-label'

type Props = {
  bloodSugarReadings: BloodSugar[]
}

export const BsHistoryChart = ({bloodSugarReadings}: Props) => {
  const getStartingChartRequest = (
    readings: BloodSugar[],
  ): IDefineAChartRequest => {
    if (
      ChartData.hasReadingType(
        readings,
        BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR,
      ) ||
      ChartData.hasReadingType(readings, BLOOD_SUGAR_TYPES.POST_PRANDIAL) ||
      ChartData.hasReadingType(readings, BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR)
    ) {
      return RequestSingleMonthChart.DefaultTypeFromAvailableReadings(readings)
    }

    if (ChartData.hasReadingType(readings, BLOOD_SUGAR_TYPES.HEMOGLOBIC)) {
      return RequestHemoglobicChart.StartingState(readings)
    }

    throw new Error('Unhandled blood sugar type')
  }

  const intl = useIntl()

  const [requestedChart, setRequestedChart] = useState<IDefineAChartRequest>(
    getStartingChartRequest(bloodSugarReadings),
  )

  const [chartData, setChartData] = useState<ChartData | null>(null)

  useEffect(() => {
    setChartData(new ChartData(requestedChart, bloodSugarReadings))
  }, [bloodSugarReadings, requestedChart])

  const getMaxThreshhold = (): number => {
    if (!chartData) {
      throw new Error('Unable to get max threshold as chart data is null')
    }

    switch (chartData.getChartType()) {
      case BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR:
        return 126
      case BLOOD_SUGAR_TYPES.HEMOGLOBIC:
        return 7
      default:
        return 200
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
        return 70
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
    if (
      newChartType === BLOOD_SUGAR_TYPES.HEMOGLOBIC &&
      requestedChart instanceof RequestSingleMonthChart
    ) {
      setRequestedChart(requestedChart.moveBackOnMonth())
    } else {
      setRequestedChart(
        requestedChart.changeRequestedType(newChartType, bloodSugarReadings),
      )
    }
  }

  if (!chartData) {
    return <GraphLoadingPlaceholder />
  }

  return (
    <>
      <View style={{flexDirection: 'row'}}>
        {(chartData.getHasRandomReadings() ||
          chartData.getHasPostPrandialReadings()) && (
          <ChartTypeSelectionPill
            changeChartType={changeChartTypeHandler}
            currentChartType={chartData.getChartType()}
            newChartType={BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR}
            pillLabel={
              intl.formatMessage({
                id: 'bs.random-blood-code',
              }) +
              '/' +
              intl.formatMessage({
                id: 'bs.post-prenial-code',
              })
            }
          />
        )}
        {chartData.getHasFastingReadings() && (
          <ChartTypeSelectionPill
            changeChartType={changeChartTypeHandler}
            currentChartType={chartData.getChartType()}
            newChartType={BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR}
            pillLabel={intl.formatMessage({
              id: 'bs.fasting-code',
            })}
          />
        )}
        {chartData.getHasHemoglobicReadings() && (
          <ChartTypeSelectionPill
            changeChartType={changeChartTypeHandler}
            currentChartType={chartData.getChartType()}
            newChartType={BLOOD_SUGAR_TYPES.HEMOGLOBIC}
            pillLabel={intl.formatMessage({
              id: 'bs.hemoglobic-code',
            })}
          />
        )}
      </View>
      <View
        style={{
          height: 260,
          borderColor: colors.grey3,
          borderLeftWidth: 1,
          borderTopWidth: 1,
          position: 'relative',
        }}>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            flexDirection: 'row',
            paddingLeft: 6,
          }}>
          {chartData.getAxisTickValues().map((value, index) => {
            if (value instanceof MonthNameAxisLabel) {
              return <MonthAndYearLabel key={index} data={value} />
            } else if (value instanceof DayOfMonthAxisLabel) {
              return <DayOfMonthLabel key={index} data={value} />
            } else if (value instanceof MonthInitialAxisLabel) {
              return <MonthInitialLabel key={index} data={value} />
            }
          })}

          <View style={{width: 32}} />
        </View>
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
          <EmptyYLeftAxis />
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
          <VictoryScatter
            data={chartData.getScatterDataForGraph()}
            size={5}
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
    </>
  )
}
