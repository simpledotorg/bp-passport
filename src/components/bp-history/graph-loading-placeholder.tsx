import React from 'react'
import {View, ActivityIndicator} from 'react-native'
import {colors} from '../../styles'
import {TitleBar} from './../victory-chart-parts/title-bar'

type Props = {
  chartTitle: string
}

export const GraphLoadingPlaceholder = ({chartTitle}: Props) => {
  return (
    <>
      <TitleBar
        chartTitle={chartTitle}
        hasPreviousPeriod={false}
        hasNextPeriod={false}
      />
      <View
        style={{
          height: 260,
          borderColor: colors.grey3,
          borderLeftWidth: 1,
          borderTopWidth: 1,
          alignContent: 'center',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size="large" color={colors.blue1} />
      </View>
    </>
  )
}
