import React from 'react'
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

import {BodyText} from '../text'
import {colors} from '../../styles'

type ButtonProps = {
  iconName: string
  enabled: boolean
  moveToPeriod?: () => void
  style?: StyleProp<ViewStyle>
}

type TitleBarProps = {
  chartTitle: string
  hasPreviousPeriod: boolean
  hasNextPeriod: boolean
  moveToNextPeriodHandler?: () => void
  moveToPreviousPeriodHandler?: () => void
}

const ChangePeriodButton = ({
  iconName,
  enabled,
  moveToPeriod,
  style,
}: ButtonProps) => {
  if (!enabled || moveToPeriod === undefined) {
    return (
      <View style={[styles.pill, style]}>
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
      <View style={[styles.pill, styles.pillActive, style]}>
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
      <BodyText
        style={{fontSize: 18, lineHeight: 28, marginBottom: 9, flex: 1}}>
        {chartTitle}
      </BodyText>
      <View style={{flexDirection: 'row'}}>
        <ChangePeriodButton
          iconName="chevron-left"
          enabled={hasPreviousPeriod}
          moveToPeriod={moveToPreviousPeriodHandler}
        />
        <ChangePeriodButton
          style={{marginLeft: 16}}
          iconName="chevron-right"
          enabled={hasNextPeriod}
          moveToPeriod={moveToNextPeriodHandler}
        />
      </View>
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
