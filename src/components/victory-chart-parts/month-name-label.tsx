import React from 'react'
import {MonthNameAxisLabel} from './month-name-axis-label'
import {View} from 'react-native'
import {BodyText} from '../text'
import {colors} from '../../styles'

type Props = {
  data: MonthNameAxisLabel
}

export const MonthNameLabel = ({data}: Props) => {
  return (
    <View
      style={{
        flex: 1,
        flexShrink: 0,
      }}>
      <BodyText
        style={{
          color: colors.grey1,
          fontWeight: '500',
          fontSize: 14,
          lineHeight: 18,
        }}>
        {data.monthName}
      </BodyText>
    </View>
  )
}
