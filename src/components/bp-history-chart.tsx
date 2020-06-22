import React, {useState, useEffect} from 'react'
import {View, Dimensions} from 'react-native'
import {format, addMonths} from 'date-fns'
import {zonedTimeToUtc} from 'date-fns-tz'
import {
  VictoryChart,
  VictoryTheme,
  VictoryLine,
  VictoryScatter,
  VictoryAxis,
  VictoryTooltip,
  VictoryBar,
  VictoryVoronoiContainer,
  VictoryGroup,
} from 'victory-native'

import {BloodPressure} from '../redux/blood-pressure/blood-pressure.models'
import {colors} from '../styles'
import {generateAverageChartData} from '../utils/data-transform'
import {CHART_MONTH_RANGE} from '../utils/dates'
import {DateRange} from '../utils/dates'
import {BodyText} from './text'
import {dateLocale} from '../constants/languages'

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
    min: null | number
    max: null | number
  } | null>(null)

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

  useEffect(() => {
    setChartData(
      generateAverageChartData(bps, averageList, isBloodPressureHigh),
    )
  }, [bps])

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
    return null
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
        {[...Array(CHART_MONTH_RANGE)].map((value, index) => {
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
                {format(addMonths(chartData.dates[0].date, index), 'MMM', {
                  locale: dateLocale(),
                })}
              </BodyText>
              <BodyText
                style={{
                  color: colors.grey2,
                  fontWeight: '500',
                  fontSize: 14,
                  lineHeight: 18,
                }}>
                {format(addMonths(chartData.dates[0].date, index), 'yyy', {
                  locale: dateLocale(),
                })}
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
          tickCount={CHART_MONTH_RANGE}
          tickFormat={(tick) => {
            return format(
              addMonths(chartData.dates[0].date, tick / 4),
              'MMM-yy',
              {
                locale: dateLocale(),
              },
            )
          }}
          tickValues={chartData.dates.map((date, index) => index)}
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
        {/* CANDLESTICK CHART */}
        {/* <VictoryBar
          data={chartData.high.map((bp, index) => {
            return {
              x: bp.index,
              y: bp.averaged.systolic,
              y0: bp.averaged.diastolic,
            }
          })}
          style={{
            data: {
              fill: colors.red1,
              width: 8,
            },
          }}
        />

        <VictoryBar
          data={chartData.low.map((bp, index) => {
            return {
              x: bp.index,
              y: bp.averaged.systolic,
              y0: bp.averaged.diastolic,
            }
          })}
          style={{
            data: {
              fill: colors.green1,
              width: 8,
            },
          }}
        />

        <VictoryScatter
          data={chartData.low.flatMap((bp) => {
            return [
              {x: bp.index, y: bp.averaged.systolic},
              {x: bp.index, y: bp.averaged.diastolic},
            ]
          })}
          size={1}
          style={{
            data: {fill: colors.green1, stroke: colors.green1, strokeWidth: 2},
          }}
        />

        <VictoryScatter
          data={chartData.high.flatMap((bp) => {
            return [
              {x: bp.index, y: bp.averaged.systolic},
              {x: bp.index, y: bp.averaged.diastolic},
            ]
          })}
          size={1}
          style={{
            data: {fill: colors.red1, stroke: colors.red1, strokeWidth: 2},
          }}
        /> */}
        {/* LINE CHART */}
        {/* <VictoryLine
          data={[...chartData.low, ...chartData.high].map((bp, index) => {
            try {
              return {
                x: bp.index,
                y: bp.averaged.systolic,
              }
            } catch (e) {
              return null
            }
          })}
          style={{
            data: {
              stroke: colors.green1,
            },
          }}
        />

        <VictoryLine
          data={[...chartData.low, ...chartData.high].map((bp) => {
            try {
              return {
                x: bp.index,
                y: bp.averaged.diastolic,
              }
            } catch (e) {
              return null
            }
          })}
          style={{
            data: {
              stroke: colors.green1,
            },
          }}
        /> */}
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
              stroke: colors.grey1,
              strokeWidth: 1,
            },
          }}
        />

        <VictoryScatter
          data={[...chartData.low, ...chartData.high].flatMap(
            (bp: DateRange) => {
              return [
                bp.averaged.systolic < 140
                  ? {
                      x: bp.index,
                      y: bp.averaged.systolic,
                      label: `${bp.averaged.systolic} / ${
                        bp.averaged.diastolic
                      }, ${format(bp.date, 'dd-MMM-yyyy')}`,
                    }
                  : null,
                bp.averaged.diastolic < 90
                  ? {
                      x: bp.index,
                      y: bp.averaged.diastolic,
                      label: `${bp.averaged.systolic} / ${
                        bp.averaged.diastolic
                      }, ${format(bp.date, 'dd-MMM-yyyy')}`,
                    }
                  : null,
              ]
            },
          )}
          size={5}
          style={{
            data: {
              fill: colors.green1,
            },
          }}
          events={[
            {
              target: 'data',
              eventHandlers: {
                onPressIn: () => {
                  return [
                    {
                      target: 'data',
                      mutation: () => ({
                        style: {
                          stroke: colors.blue2,
                          strokeWidth: 3,
                          fill: colors.white,
                        },
                      }),
                    },
                    {
                      target: 'labels',
                      mutation: () => ({active: true}),
                    },
                  ]
                },
                onPressOut: () => {
                  return [
                    {
                      target: 'data',
                      mutation: () => {},
                    },
                    {
                      target: 'labels',
                      mutation: () => ({active: false}),
                    },
                  ]
                },
              },
            },
          ]}
          labelComponent={
            <VictoryTooltip
              renderInPortal={false}
              constrainToVisibleArea={true}
              cornerRadius={20}
              pointerLength={5}
              flyoutStyle={{
                height: 32,
                padding: 200,
                fill: colors.grey0,
              }}
              style={{fill: colors.white}}
            />
          }
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
              stroke: colors.grey1,
              strokeWidth: 1,
            },
          }}
        />
        <VictoryScatter
          data={[...chartData.low, ...chartData.high].flatMap(
            (bp: DateRange) => {
              return [
                bp.averaged.systolic < 140
                  ? {
                      x: bp.index,
                      y: bp.averaged.systolic,
                      label: `${bp.averaged.systolic.toFixed(
                        0,
                      )} / ${bp.averaged.diastolic.toFixed(0)}, ${format(
                        bp.date,
                        'dd-MMM-yyyy',
                      )}`,
                    }
                  : null,
                bp.averaged.diastolic < 90
                  ? {
                      x: bp.index,
                      y: bp.averaged.diastolic,
                      label: `${bp.averaged.systolic.toFixed(
                        0,
                      )} / ${bp.averaged.diastolic.toFixed(0)}, ${format(
                        bp.date,
                        'dd-MMM-yyyy',
                      )}`,
                    }
                  : null,
              ]
            },
          )}
          size={5}
          style={{
            data: {
              fill: colors.green1,
            },
          }}
          events={[
            {
              target: 'data',
              eventHandlers: {
                onPressIn: () => {
                  return [
                    {
                      target: 'data',
                      mutation: () => ({
                        style: {
                          fill: colors.white,
                          stroke: colors.blue2,
                          strokeWidth: 3,
                        },
                      }),
                    },
                    {
                      target: 'labels',
                      mutation: () => ({active: true}),
                    },
                  ]
                },
                onPressOut: () => {
                  return [
                    {
                      target: 'data',
                      mutation: () => {},
                    },
                    {
                      target: 'labels',
                      mutation: () => ({active: false}),
                    },
                  ]
                },
              },
            },
          ]}
          labelComponent={
            <VictoryTooltip
              renderInPortal={false}
              constrainToVisibleArea={true}
              cornerRadius={20}
              pointerLength={5}
              flyoutStyle={{
                height: 32,
                padding: 200,
                fill: colors.grey0,
              }}
              style={{fill: colors.white}}
            />
          }
        />
        <VictoryScatter
          data={[...chartData.low, ...chartData.high].flatMap(
            (bp: DateRange) => {
              return [
                bp.averaged.systolic >= 140
                  ? {
                      x: bp.index,
                      y: bp.averaged.systolic,
                      label: `${bp.averaged.systolic.toFixed(
                        0,
                      )} / ${bp.averaged.diastolic.toFixed(0)}, ${format(
                        bp.date,
                        'dd-MMM-yyyy',
                      )}`,
                    }
                  : null,
                bp.averaged.diastolic >= 90
                  ? {
                      x: bp.index,
                      y: bp.averaged.diastolic,
                      label: `${bp.averaged.systolic.toFixed(
                        0,
                      )} / ${bp.averaged.diastolic.toFixed(0)}, ${format(
                        bp.date,
                        'dd-MMM-yyyy',
                      )}`,
                    }
                  : null,
              ]
            },
          )}
          size={5}
          style={{
            data: {
              fill: colors.red1,
            },
          }}
          events={[
            {
              target: 'data',
              eventHandlers: {
                onPressIn: () => {
                  return [
                    {
                      target: 'data',
                      mutation: () => ({
                        style: {
                          stroke: colors.blue2,
                          strokeWidth: 3,
                        },
                      }),
                    },
                    {
                      target: 'labels',
                      mutation: () => ({active: true}),
                    },
                  ]
                },
                onPressOut: () => {
                  return [
                    {
                      target: 'data',
                      mutation: () => {},
                    },
                    {
                      target: 'labels',
                      mutation: () => ({active: false}),
                    },
                  ]
                },
              },
            },
          ]}
          labelComponent={
            <VictoryTooltip
              renderInPortal={false}
              constrainToVisibleArea={true}
              cornerRadius={20}
              pointerLength={5}
              flyoutStyle={{
                height: 32,
                fill: colors.grey0,
              }}
              style={{fill: colors.white}}
            />
          }
        />
      </VictoryChart>
    </View>
  )
}
