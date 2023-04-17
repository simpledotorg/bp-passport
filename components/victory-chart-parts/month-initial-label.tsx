import React from 'react'
import { MonthInitialAxisLabel } from './month-initial-axis-label'
import { View } from 'react-native'
import { BodyText } from '../text'
import { colors } from '../../styles'

type Props = {
  data: MonthInitialAxisLabel
}

export const MonthInitialLabel = ({ data }: Props) => {
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
        {data.monthInitial}
      </BodyText>
    </View>
  )
}
