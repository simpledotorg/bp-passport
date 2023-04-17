import React from 'react'
import { MonthNameAxisLabel } from './month-name-axis-label'
import { View } from 'react-native'
import { BodyText } from '../text'
import { colors } from '../../styles'

type Props = {
  data: MonthNameAxisLabel
}

export const MonthAndYearLabel = ({ data }: Props) => {
  return (
    <View
      style={{
        flex: 1,
        flexShrink: 0,
      }}
    >
      <BodyText
        style={{
          color: colors.grey0,
          fontWeight: '500',
          fontSize: 14,
          lineHeight: 18,
        }}
      >
        {data.monthName}
      </BodyText>
      <BodyText
        style={{
          color: colors.grey2,
          fontWeight: '500',
          fontSize: 14,
          lineHeight: 18,
        }}
      >
        {data.year}
      </BodyText>
    </View>
  )
}
