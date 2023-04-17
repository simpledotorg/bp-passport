import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import { colors } from '../../styles'
import { TitleBar } from './../victory-chart-parts/title-bar'
import { ChartTypeSelection } from './chart-type-selection'
import { IDefineChartsAvailable } from './i-define-charts-available'

type Props = {
  chartsAvailable: IDefineChartsAvailable
}

export const GraphLoadingPlaceholder = ({ chartsAvailable }: Props) => {
  return (
    <>
      <TitleBar
        chartTitle={chartsAvailable.getTitle()}
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
        }}
      >
        <ActivityIndicator size="large" color={colors.blue1} />
      </View>
      <ChartTypeSelection chartTypesAvailable={chartsAvailable} />
    </>
  )
}
