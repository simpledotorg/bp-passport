import React from 'react'
import { View } from 'react-native'
import { DayOfMonthAxisLabel } from './day-of-month-axis-label'
import { MonthNameAxisLabel } from './month-name-axis-label'
import { MonthInitialAxisLabel } from './month-initial-axis-label'
import { MonthNameLabel } from './month-name-label'
import { MonthInitialLabel } from './month-initial-label'
import { DayOfMonthLabel } from './day-of-month-label'
import { IDefineAdateAxisLabel } from './i-define-a-date-axis-label'

type Props = {
  tickValues: IDefineAdateAxisLabel[]
}
export const DateAxisComponent = ({ tickValues }: Props) => {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        paddingLeft: 6,
      }}
    >
      {tickValues.map((value, index) => {
        if (value instanceof MonthNameAxisLabel) {
          return <MonthNameLabel key={index} data={value} />
        } else if (value instanceof DayOfMonthAxisLabel) {
          return <DayOfMonthLabel key={index} data={value} />
        } else if (value instanceof MonthInitialAxisLabel) {
          return <MonthInitialLabel key={index} data={value} />
        }
      })}

      <View style={{ width: 32 }} />
    </View>
  )
}
