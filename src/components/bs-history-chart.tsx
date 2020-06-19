import React, {useState, useEffect} from 'react'
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native'
import {FormattedMessage} from 'react-intl'
import {
  VictoryChart,
  VictoryTheme,
  VictoryScatter,
  VictoryAxis,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory-native'

import {
  BloodSugar,
  BLOOD_SUGAR_TYPES,
} from '../redux/blood-sugar/blood-sugar.models'
import {colors, containerStyles} from '../styles'
import {BodyText} from './text'
import {CHART_MONTH_RANGE} from '../utils/dates'

import {RequestChart} from './bs-history/request-chart'
import {ChartData} from './bs-history/chart-data'

type Props = {
  bss: BloodSugar[]
}

export const BsHistoryChart = ({bss}: Props) => {
  const [requestedChart, setRequestedChart] = useState<RequestChart>(
    RequestChart.DefaultTypeFromAvailableReadings(bss),
  )

  const [chartData, setChartData] = useState<ChartData | null>(null)

  /*
  const bloodSugarType = () => {
    
  }
*/

  useEffect(() => {
    setChartData(new ChartData(requestedChart.getChartType(), bss))
  }, [bss, requestedChart])

  /*
  const generateScatter = (bss: DateRange[]): any[] => {
    return bss.map((bs: DateRange) => {
      return {
        x: bs.index,
        y: bs.averaged,
        label: 
      }
    })
  }*/

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

  if (!chartData) {
    return (
      <View
        style={[
          containerStyles.fill,
          containerStyles.centeredContent,
          {height: 260},
        ]}>
        <ActivityIndicator size="large" color={colors.blue1} />
      </View>
    )
  }

  return (
    <>
      <View style={{flexDirection: 'row'}}>
        {(chartData.getHasRandomReadings() ||
          chartData.getHasPostPrandialReadings()) && (
          <TouchableWithoutFeedback
            onPress={() => {
              setChartData(null)
              setRequestedChart(
                RequestChart.FromUserSelected(
                  BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR,
                ),
              )
            }}>
            <View
              style={[
                styles.pill,
                chartData.getChartType() ===
                BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR
                  ? styles.pillActive
                  : {},
              ]}>
              <BodyText
                style={{
                  color:
                    chartData.getChartType() ===
                    BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR
                      ? colors.white100
                      : colors.blue2,
                }}>
                <FormattedMessage id="bs.random-blood-code" />/
                <FormattedMessage id="bs.post-prenial-code" />
              </BodyText>
            </View>
          </TouchableWithoutFeedback>
        )}
        {chartData.getHasFastingReadings() && (
          <TouchableWithoutFeedback
            onPress={() => {
              setChartData(null)
              setRequestedChart(
                RequestChart.FromUserSelected(
                  BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR,
                ),
              )
            }}>
            <View
              style={[
                styles.pill,
                chartData.getChartType() ===
                BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR
                  ? styles.pillActive
                  : {},
              ]}>
              <BodyText
                style={{
                  color:
                    chartData.getChartType() ===
                    BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR
                      ? colors.white100
                      : colors.blue2,
                }}>
                <FormattedMessage id="bs.fasting-code" />
              </BodyText>
            </View>
          </TouchableWithoutFeedback>
        )}
        {chartData.getHasHemoglobicReadings() && (
          <TouchableWithoutFeedback
            onPress={() => {
              setChartData(null)
              setRequestedChart(
                RequestChart.FromUserSelected(BLOOD_SUGAR_TYPES.HEMOGLOBIC),
              )
            }}>
            <View
              style={[
                styles.pill,
                chartData.getChartType() === BLOOD_SUGAR_TYPES.HEMOGLOBIC
                  ? styles.pillActive
                  : {},
              ]}>
              <BodyText
                style={{
                  color:
                    chartData.getChartType() === BLOOD_SUGAR_TYPES.HEMOGLOBIC
                      ? colors.white100
                      : colors.blue2,
                }}>
                <FormattedMessage id="bs.hemoglobic-code" />
              </BodyText>
            </View>
          </TouchableWithoutFeedback>
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
          containerComponent={<VictoryVoronoiContainer radius={20} />}>
          <VictoryAxis
            tickCount={CHART_MONTH_RANGE}
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
          <VictoryScatter
            data={chartData.getScatterDataForGraph()}
            size={5}
            style={{
              data: {
                fill: ({datum}) =>
                  datum.showOutOfRange ? colors.red1 : colors.green1,
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
                            boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)',
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
        </VictoryChart>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.blue3,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12,
    marginRight: 12,
  },
  pillActive: {
    backgroundColor: colors.blue2,
  },
})
