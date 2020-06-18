import React, {useState, useEffect} from 'react'
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native'
import {format, addMonths} from 'date-fns'
import {FormattedMessage} from 'react-intl'
import {
  VictoryChart,
  VictoryTheme,
  VictoryScatter,
  VictoryAxis,
  VictoryTooltip,
  VictoryLine,
} from 'victory-native'

import {
  BloodSugar,
  BLOOD_SUGAR_TYPES,
} from '../redux/blood-sugar/blood-sugar.models'
import {colors, containerStyles} from '../styles'
import {isHighBloodSugar, isLowBloodSugar} from '../utils/blood-sugars'
import {BodyText} from './text'
import {DateRange} from '../utils/dates'
import {generateAverageChartData, getIndexFromBP} from '../utils/data-transform'
import {CHART_MONTH_RANGE, getChartDateRange} from '../utils/dates'
import {dateLocale} from '../constants/languages'

type Props = {
  bss: BloodSugar[]
}

export const BsHistoryChart = ({bss}: Props) => {
  const useAverageData = false
  const [shownSugarType, setShownSugarType] = useState<BLOOD_SUGAR_TYPES>(
    BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR,
  )
  const [hasRandom, setHasRandom] = useState<boolean>(false)
  const [hasFasting, setHasFasting] = useState<boolean>(false)
  const [hasHemoglobic, setHasHemoglobic] = useState<boolean>(false)

  const [averageChartData, setAverageChartData] = useState<{
    dates: DateRange[]
    low: DateRange[]
    high: DateRange[]
    min: null | number
    max: null | number
  } | null>(null)

  const [fullChartData, setFullChartData] = useState<{
    dates: DateRange[]
    data: BloodSugar[]
  } | null>(null)

  const averageList = (value: DateRange) => {
    const valuesAccumulator = value.list.reduce(
      (memo: number, current: any) => {
        return (memo += Number(current.blood_sugar_value))
      },
      0,
    )

    return valuesAccumulator / value.list.length
  }

  useEffect(() => {
    setHasRandom(
      !!bss.find((bs) => {
        return (
          bs.blood_sugar_type === BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR ||
          bs.blood_sugar_type === BLOOD_SUGAR_TYPES.POST_PRANDIAL
        )
      }),
    )

    setHasFasting(
      !!bss.find((bs) => {
        return bs.blood_sugar_type === BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR
      }),
    )

    setHasHemoglobic(
      !!bss.find((bs) => {
        return bs.blood_sugar_type === BLOOD_SUGAR_TYPES.HEMOGLOBIC
      }),
    )
  }, [bss])

  useEffect(() => {
    if (hasRandom) {
      setShownSugarType(BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR)
    } else if (hasFasting) {
      setShownSugarType(BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR)
    } else {
      setShownSugarType(BLOOD_SUGAR_TYPES.HEMOGLOBIC)
    }
  }, [hasRandom, hasFasting, hasHemoglobic])

  useEffect(() => {
    const filteredValues = bss.filter((bs) => {
      if (shownSugarType === BLOOD_SUGAR_TYPES.HEMOGLOBIC) {
        return bs.blood_sugar_type === BLOOD_SUGAR_TYPES.HEMOGLOBIC
      } else if (shownSugarType === BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR) {
        return bs.blood_sugar_type === BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR
      } else {
        return (
          bs.blood_sugar_type !== BLOOD_SUGAR_TYPES.HEMOGLOBIC &&
          bs.blood_sugar_type !== BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR
        )
      }
    })

    if (useAverageData) {
      setAverageChartData(
        generateAverageChartData(filteredValues, averageList, (value) => {
          return isHighBloodSugar({
            blood_sugar_value: value,
            blood_sugar_type: shownSugarType,
          } as BloodSugar)
        }),
      )
    } else {
      setFullChartData({
        dates: getChartDateRange(),
        data: filteredValues,
      })
    }
  }, [bss, shownSugarType])

  const generateAverageScatter = (bloodSugarData: DateRange[]): any[] => {
    return bloodSugarData.map((bs: DateRange) => {
      return {x: bs.index, y: bs.averaged, label: bs.averaged}
    })
  }

  const generateFullScatter = (chartData: any): any[] => {
    return chartData.data.map((bs: BloodSugar) => {
      return {
        x: getIndexFromBP(chartData.dates, bs),
        y: Number(bs.blood_sugar_value),
        label: bs.blood_sugar_value,
        showOutOfRange: isHighBloodSugar(bs) || isLowBloodSugar(bs),
      }
    })
  }

  const getMaxThreshhold = (): number => {
    switch (shownSugarType) {
      case BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR:
        return 126
      case BLOOD_SUGAR_TYPES.HEMOGLOBIC:
        return 7
      default:
        return 200
    }
  }

  const getMinThreshhold = (): number | null => {
    switch (shownSugarType) {
      case BLOOD_SUGAR_TYPES.HEMOGLOBIC:
        return null
      default:
        return 70
    }
  }

  const getMaxDomain = () => {
    const threshhold = getMaxThreshhold()
    const difference = Math.round(threshhold / 10)
    let base = (useAverageData ? averageChartData?.max ?? threshhold : 400) ?? 0

    if (base < threshhold) {
      base = threshhold
    }

    return base + difference
  }

  const getMinDomain = () => {
    const threshhold = getMinThreshhold() ?? getMaxThreshhold()
    const difference = Math.round(getMaxThreshhold() / 10)
    let base = (useAverageData ? averageChartData?.min ?? threshhold : 50) ?? 0

    if (base > threshhold) {
      base = threshhold
    }

    return base - difference
  }

  if (!averageChartData && !fullChartData) {
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
        {hasRandom && (
          <TouchableWithoutFeedback
            onPress={() => {
              setShownSugarType(BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR)
            }}>
            <View
              style={[
                styles.pill,
                shownSugarType === BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR
                  ? styles.pillActive
                  : {},
              ]}>
              <BodyText
                style={{
                  color:
                    shownSugarType === BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR
                      ? colors.white100
                      : colors.blue2,
                }}>
                <FormattedMessage id="bs.random-blood-code" />/
                <FormattedMessage id="bs.post-prenial-code" />
              </BodyText>
            </View>
          </TouchableWithoutFeedback>
        )}
        {hasFasting && (
          <TouchableWithoutFeedback
            onPress={() => {
              setShownSugarType(BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR)
            }}>
            <View
              style={[
                styles.pill,
                shownSugarType === BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR
                  ? styles.pillActive
                  : {},
              ]}>
              <BodyText
                style={{
                  color:
                    shownSugarType === BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR
                      ? colors.white100
                      : colors.blue2,
                }}>
                <FormattedMessage id="bs.fasting-code" />
              </BodyText>
            </View>
          </TouchableWithoutFeedback>
        )}
        {hasHemoglobic && (
          <TouchableWithoutFeedback
            onPress={() => {
              setShownSugarType(BLOOD_SUGAR_TYPES.HEMOGLOBIC)
            }}>
            <View
              style={[
                styles.pill,
                shownSugarType === BLOOD_SUGAR_TYPES.HEMOGLOBIC
                  ? styles.pillActive
                  : {},
              ]}>
              <BodyText
                style={{
                  color:
                    shownSugarType === BLOOD_SUGAR_TYPES.HEMOGLOBIC
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
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            flexDirection: 'row',
            paddingLeft: 6,
          }}>
          {averageChartData &&
            [...Array(CHART_MONTH_RANGE)].map((value, index) => {
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
                    {format(
                      addMonths(averageChartData.dates[0].date, index),
                      'MMM',
                      {
                        locale: dateLocale(),
                      },
                    )}
                  </BodyText>
                  <BodyText
                    style={{
                      color: colors.grey2,
                      fontWeight: '500',
                      fontSize: 14,
                      lineHeight: 18,
                    }}>
                    {format(
                      addMonths(averageChartData.dates[0].date, index),
                      'yyy',
                      {
                        locale: dateLocale(),
                      },
                    )}
                  </BodyText>
                </View>
              )
            })}
          {fullChartData &&
            [...Array(CHART_MONTH_RANGE)].map((value, index) => {
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
                    {format(
                      addMonths(fullChartData.dates[0].date, index),
                      'MMM',
                      {
                        locale: dateLocale(),
                      },
                    )}
                  </BodyText>
                  <BodyText
                    style={{
                      color: colors.grey2,
                      fontWeight: '500',
                      fontSize: 14,
                      lineHeight: 18,
                    }}>
                    {format(
                      addMonths(fullChartData.dates[0].date, index),
                      'yyy',
                      {
                        locale: dateLocale(),
                      },
                    )}
                  </BodyText>
                </View>
              )
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
          theme={VictoryTheme.material}>
          {averageChartData && (
            <VictoryAxis
              tickCount={CHART_MONTH_RANGE}
              tickFormat={(tick) => {
                return format(
                  addMonths(averageChartData.dates[0].date, tick / 4),
                  'MMM-yy',
                  {
                    locale: dateLocale(),
                  },
                )
              }}
              tickValues={averageChartData.dates.map((date, index) => index)}
              style={{
                grid: {stroke: colors.grey3, strokeDasharray: 4},
                axis: {stroke: colors.grey3, opacity: 0},
                ticks: {opacity: 0},
                tickLabels: {opacity: 0},
              }}
            />
          )}
          {fullChartData && (
            <VictoryAxis
              tickCount={CHART_MONTH_RANGE}
              tickFormat={(tick) => {
                return format(
                  addMonths(fullChartData.dates[0].date, tick / 4),
                  'MMM-yy',
                  {
                    locale: dateLocale(),
                  },
                )
              }}
              tickValues={fullChartData.dates.map((date, index) => index)}
              style={{
                grid: {stroke: colors.grey3, strokeDasharray: 4},
                axis: {stroke: colors.grey3, opacity: 0},
                ticks: {opacity: 0},
                tickLabels: {opacity: 0},
              }}
            />
          )}
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
              if (shownSugarType === BLOOD_SUGAR_TYPES.HEMOGLOBIC) {
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
                if (shownSugarType === BLOOD_SUGAR_TYPES.HEMOGLOBIC) {
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
          {fullChartData && (
            <VictoryLine
              data={[
                {x: 1, y: 70},
                {x: 1, y: 200},
              ]}
              style={{
                data: {
                  stroke: colors.grey1,
                  strokeWidth: 1,
                },
              }}
            />
          )}
          {fullChartData && (
            <VictoryLine
              data={[
                {x: 107, y: 100},
                {x: 107, y: 300},
              ]}
              style={{
                data: {
                  stroke: colors.grey4,
                  strokeWidth: 6,
                },
              }}
            />
          )}
          {averageChartData && (
            <VictoryScatter
              data={generateAverageScatter(averageChartData.low)}
              size={4}
              style={{
                data: {
                  fill: colors.green1,
                },
              }}
              labelComponent={<VictoryTooltip renderInPortal={false} />}
            />
          )}
          {averageChartData && (
            <VictoryScatter
              data={generateAverageScatter(averageChartData.high)}
              size={4}
              style={{
                data: {
                  fill: colors.red1,
                },
              }}
              labelComponent={<VictoryTooltip renderInPortal={false} />}
            />
          )}

          {fullChartData && (
            <VictoryScatter
              data={generateFullScatter(fullChartData)}
              size={4}
              style={{
                data: {
                  fill: ({datum}) =>
                    datum.showOutOfRange ? colors.red1 : colors.green1,
                },
              }}
              labelComponent={<VictoryTooltip renderInPortal={false} />}
            />
          )}
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
