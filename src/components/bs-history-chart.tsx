import React, {useState, useEffect} from 'react'
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native'
import {format, addMonths, isWithinInterval} from 'date-fns'
import {FormattedMessage} from 'react-intl'
import {
  VictoryChart,
  VictoryTheme,
  VictoryScatter,
  VictoryAxis,
  VictoryTooltip,
} from 'victory-native'

import {
  BloodSugar,
  BLOOD_SUGAR_TYPES,
} from '../redux/blood-sugar/blood-sugar.models'
import {colors} from '../styles'
import {
  displayDate,
  isHighBloodSugar,
  getBloodSugarDetails,
} from '../utils/blood-sugars'
import {BodyHeader, BodyText} from './text'
import {getChartDateRange} from '../utils/dates'

interface BloodSugarChartPoint {
  interval: {start: Date; end: Date}
  list: BloodSugar[]
  averaged: number
}

type Props = {
  bss: BloodSugar[]
}

export const BsHistoryChart = ({bss}: Props) => {
  const [isPercentage, setIsPercentage] = useState(false)
  const [highBps, setHighBps] = useState<BloodSugarChartPoint[] | null>(null)
  const [lowBps, setLowBps] = useState<BloodSugarChartPoint[] | null>(null)
  const dates: BloodSugarChartPoint[] = getChartDateRange()

  const getIndexFromBP = (bp: BloodSugar) => {
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

  // useEffect(() => {
  //   const filteredValues = bss.filter((bs) => {
  //     if (isPercentage) {
  //       return bs.blood_sugar_type === BLOOD_SUGAR_TYPES.HEMOGLOBIC
  //     }

  //     return bs.blood_sugar_type !== BLOOD_SUGAR_TYPES.HEMOGLOBIC
  //   })

  //   filteredValues.forEach((bs) => {
  //     const index = getIndexFromBP(bs)
  //     if (dates[index]) {
  //       dates[index].list.push(bs)
  //     }
  //   })

  //   const reduction = dates.reduce(
  //     (
  //       memo: {high: BloodSugarChartPoint[]; low: BloodSugarChartPoint[]},
  //       current: BloodSugarChartPoint,
  //     ) => {
  //       if (current.list.length) {
  //         const valuesAccumulator = current.list.reduce(
  //           (memoAcc: number, currentAcc: BloodSugar) => {
  //             return (memoAcc += Number(currentAcc.blood_sugar_value))
  //           },
  //           0,
  //         )

  //         const average = valuesAccumulator / current.list.length

  //         current.averaged = average

  //         if (isHighBloodSugar({blood_sugar_type: , } as BloodSugar)) {
  //           memo.high.push({...current, averaged: average})
  //         } else {
  //           memo.low.push({...current, averaged: average})
  //         }

  //         console.log(current)
  //       }
  //       return memo
  //     },
  //     {high: [], low: []},
  //   )

  //   setHighBps(reduction.high)
  //   setLowBps(reduction.low)
  // }, [bss, isPercentage])

  const generateScatter = (
    bps: BloodSugarChartPoint[],
  ): BloodSugarChartPoint[] => {
    return bps.flatMap((bp: BloodSugarChartPoint) => {
      const index = getIndexFromBP(bp.list[0])

      return [
        {
          x: index + 1,
          y: bp.averaged,
          label: bp.averaged,
        },
      ]
    })
  }

  if (!highBps || !lowBps) {
    return <></>
  }

  return (
    <>
      <View style={{flexDirection: 'row'}}>
        <TouchableWithoutFeedback
          onPress={() => {
            setIsPercentage(false)
          }}>
          <View style={[styles.pill, isPercentage ? {} : styles.pillActive]}>
            <BodyText
              style={{color: isPercentage ? colors.blue2 : colors.white100}}>
              <FormattedMessage id="bs.random-blood-code" />/
              <FormattedMessage id="bs.fasting-code" />/
              <FormattedMessage id="bs.post-prenial-code" />
            </BodyText>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            setIsPercentage(true)
          }}>
          <View style={[styles.pill, isPercentage ? styles.pillActive : {}]}>
            <BodyText
              style={{color: isPercentage ? colors.white100 : colors.blue2}}>
              <FormattedMessage id="bs.hemoglobic-code" />
            </BodyText>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View
        style={{
          height: 260,
          borderColor: colors.grey3,
          borderLeftWidth: 1,
          borderTopWidth: 1,
        }}>
        <VictoryChart
          width={Dimensions.get('window').width - 24}
          height={300}
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
            tickFormat={(tick) => {
              if (isPercentage) {
                return `${tick}%`
              }
              return tick
            }}
            tickValues={isPercentage ? [7] : [126, 200]}
            style={{
              grid: {stroke: colors.grey2, strokeDasharray: 8},
              axis: {stroke: colors.grey3, strokeWidth: 0},
              ticks: {opacity: 0},
            }}
          />

          {/* <VictoryScatter
            data={data.map((bs, index) => {
              if (!isHighBloodSugar(bs)) {
                return {
                  x: index + 1,
                  y: Number(bs.blood_sugar_value),
                  label: bs.blood_sugar_value,
                }
              }
              return null
            })}
            size={5}
            style={{
              data: {
                fill: colors.white100,
                stroke: colors.green1,
                strokeWidth: 3,
              },
            }}
            labelComponent={<VictoryTooltip />}
          />
          <VictoryScatter
            data={data.map((bs, index) => {
              if (isHighBloodSugar(bs)) {
                return {
                  x: index + 1,
                  y: Number(bs.blood_sugar_value),
                  label: bs.blood_sugar_value,
                }
              }
              return null
            })}
            size={5}
            style={{
              data: {
                fill: colors.white100,
                stroke: colors.red1,
                strokeWidth: 3,
              },
            }}
            labelComponent={<VictoryTooltip />}
          /> */}

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
