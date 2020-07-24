import React from 'react'
import {DayOfMonthAxisLabel} from './day-of-month-axis-label'
import {View} from 'react-native'
import {BodyText} from '../text'
import {colors} from '../../styles'

type Props = {
  data: DayOfMonthAxisLabel
}

export const DayOfMonthLabel = ({data}: Props) => {
  return (
    <View
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
        {data.dayOfMonth}
      </BodyText>
    </View>
  )
}
