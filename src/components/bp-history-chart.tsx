import React, {useState, useEffect} from 'react'
import {View, Dimensions} from 'react-native'
import {format, addMonths} from 'date-fns'
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
import {generateAverageChartData} from '../utils/data-transform'
import {CHART_MONTH_RANGE} from '../utils/dates'
import {DateRange} from '../utils/dates'
import {BodyText} from './text'
import {dateLocale} from '../constants/languages'
import {VictoryGraphToolTipHelper} from './victory-chart-parts/victory-graph-tool-tip-helper'
import {ChartData} from './bp-history/chart-data'
import {GraphLoadingPlaceholder} from './victory-chart-parts/graph-loading-placeholder'

type Props = {
  bps: BloodPressure[]
}

export const BpHistoryChart = ({bps}: Props) => {
  const isBloodPressureHigh = (bpIn: BloodPressure) => {
    // A “High BP” is a BP whose Systolic value is greater than or equal to 140 or whose
    // Diastolic value is greater than or equal to 90. All other BPs are “Normal BP”.
    return bpIn.systolic >= 140 || bpIn.diastolic >= 90
  }

  const [chartData, setChartData] = useState<ChartData | null>(null)

  useEffect(() => {
    setChartData(new ChartData(bps))
  }, [bps])

  const averageList = (value: DateRange) => {
    const list = [...value.list].slice(0, 2)

    const valuesAccumulator = list.reduce(
      (memo: {diastolic: number; systolic: number}, current: any) => {
        return {
          diastolic: memo.diastolic + current.diastolic,
          systolic: memo.systolic + current.systolic,
        }
      },
      {diastolic: 0, systolic: 0} as BloodPressure,
    )

    return {
      diastolic: valuesAccumulator.diastolic / list.length,
      systolic: valuesAccumulator.systolic / list.length,
    }
  }

  const getMaxDomain = () => {
    const threshhold = 140
    const difference = Math.round(threshhold / 10)
    let base = chartData?.max ?? threshhold

    if (base < threshhold) {
      base = threshhold
    }

    return base + difference
  }

  const getMinDomain = () => {
    const threshhold = 90
    const difference = Math.round(threshhold / 10)
    let base = chartData?.min ?? threshhold

    if (base > threshhold) {
      base = threshhold
    }

    return base - difference
  }

  if (!chartData) {
    return <GraphLoadingPlaceholder />
  }

  return (
    <View
      style={{
        height: 260,
        borderColor: colors.grey3,
        borderLeftWidth: 1,
        borderTopWidth: 1,
        overflow: 'visible',
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
          return (
            <View
              key={index}
              style={{
                flex: 1,
                flexShrink: 0,
              }}>
              <BodyText
                style={{
                  color: colors.grey0,
                  fontWeight: '500',
                  fontSize: 14,
                  lineHeight: 18,
                }}>
                {value.monthName}
              </BodyText>
              <BodyText
                style={{
                  color: colors.grey2,
                  fontWeight: '500',
                  fontSize: 14,
                  lineHeight: 18,
                }}>
                {value.year}
              </BodyText>
            </View>
          )
        })}
        <View style={{width: 32}} />
      </View>
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
          orientation="left"
          style={{
            axis: {
              strokeWidth: 2,
              stroke: colors.white100,
            },
            tickLabels: {
              opacity: 0,
            },
            ticks: {
              opacity: 0,
            },
            grid: {
              opacity: 0,
            },
          }}
        />
        <VictoryAxis
          orientation="right"
          dependentAxis
          tickValues={[90, 140]}
          style={{
            grid: {stroke: colors.grey2, strokeDasharray: 4},
            axis: {stroke: colors.grey3, strokeDasharray: 4, strokeWidth: 0},
            ticks: {opacity: 0},
          }}
        />
        <VictoryLine
          // data={[...chartData.low, ...chartData.high].map((bp) => {
          //   if (bp.list.length) {
          //     return {
          //       x: bp.index,
          //       y: bp.averaged.systolic,
          //     }
          //   }
          //   return null
          // })}
          style={{
            data: {
              stroke: colors.grey1,
              strokeWidth: 1,
            },
          }}
        />
        <VictoryLine
          // data={[...chartData.low, ...chartData.high].map((bp) => {
          //   if (bp.list.length) {
          //     return {
          //       x: bp.index,
          //       y: bp.averaged.diastolic,
          //     }
          //   }
          //   return null
          // })}
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
          size={5}
          style={{
            data: {
              fill: (data: any) => {
                const datum = data.datum.label.split(',')
                const values = datum[0].split(' / ')
                if (values[0] >= 140) {
                  return colors.red1
                }
                if (values[0] < 140) {
                  return colors.green1
                }

                if (values[1] >= 90) {
                  return colors.red1
                }
                if (values[1] < 90) {
                  return colors.green1
                }
              },
            },
          }}
        />
      </VictoryChart>
    </View>
  )
}
