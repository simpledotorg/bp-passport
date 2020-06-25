import React from 'react'
import {View, TouchableWithoutFeedback, StyleSheet} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

import {BodyText} from '../text'
import {colors} from '../../styles'

type ButtonProps = {
  iconName: string
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

const ChangePeriodButton = ({iconName, enabled, moveToPeriod}: ButtonProps) => {
  if (!enabled) {
    return (
      <View style={styles.pill}>
        <Icon
          name={iconName}
          size={18}
          style={{alignSelf: 'center'}}
          color={colors.grey2}
        />
      </View>
    )
  }
  return (
    <TouchableWithoutFeedback onPress={() => moveToPeriod()}>
      <View style={[styles.pill, styles.pillActive]}>
        <Icon
          name={iconName}
          size={18}
          style={{alignSelf: 'center'}}
          color={colors.blue2}
        />
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
        iconName="chevron-left"
        enabled={hasPreviousPeriod}
        moveToPeriod={moveToPreviousPeriodHandler}
      />
      <BodyText style={{fontSize: 18, lineHeight: 28, marginBottom: 9}}>
        {chartTitle}
      </BodyText>
      <ChangePeriodButton
        iconName="chevron-right"
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
