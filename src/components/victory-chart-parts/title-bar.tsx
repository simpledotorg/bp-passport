import React from 'react'
import {View, TouchableWithoutFeedback, StyleSheet} from 'react-native'

import {BodyText} from '../text'
import {colors} from '../../styles'
import {IDefineAChartRequest} from '../bs-history/i-define-a-chart-request'

type ButtonProps = {
  textToDisplay: string
  enabled: boolean
  moveToPeriod: () => void
}

type TitleBarProps = {
  chartTitle: string
  hasPreviousPeriod: boolean
  hasNextPeriod: boolean
  moveToNextPeriodHandler: () => void
  moveToPreviousPeriodHandler: () => void
}

const ChangePeriodButton = ({
  textToDisplay,
  enabled,
  moveToPeriod,
}: ButtonProps) => {
  if (!enabled) {
    return (
      <View style={styles.pill}>
        <BodyText
          style={{
            fontSize: 18,
            color: colors.grey2,
            textAlignVertical: 'center',
            alignSelf: 'center',
          }}>
          {textToDisplay}
        </BodyText>
      </View>
    )
  }
  return (
    <TouchableWithoutFeedback onPress={() => moveToPeriod()}>
      <View style={[styles.pill, styles.pillActive]}>
        <BodyText style={{fontSize: 18, color: colors.blue2}}>
          {textToDisplay}
        </BodyText>
      </View>
    </TouchableWithoutFeedback>
  )
}

export const TitleBar = ({
  chartTitle,
  hasPreviousPeriod,
  moveToPreviousPeriodHandler,
  hasNextPeriod,
  moveToNextPeriodHandler,
}: TitleBarProps) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <ChangePeriodButton
        textToDisplay="<"
        enabled={hasPreviousPeriod}
        moveToPeriod={moveToPreviousPeriodHandler}
      />
      <BodyText style={{fontSize: 18, lineHeight: 28, marginBottom: 9}}>
        {chartTitle}
      </BodyText>
      <ChangePeriodButton
        textToDisplay=">"
        enabled={hasNextPeriod}
        moveToPeriod={moveToNextPeriodHandler}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: colors.grey4,
    borderRadius: 14,
    height: 28,
    width: 28,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: colors.blue3,
  },
})
