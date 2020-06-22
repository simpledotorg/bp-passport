import React from 'react'
import {VictoryAxis} from 'victory-native'
import {colors} from '../../styles'

export const EmptyYLeftAxis = () => {
  return (
    <VictoryAxis
      orientation="left"
      style={{
        axis: {
          strokeWidth: 2,
          stroke: colors.white100,
        },
        tickLabels: {
          opacity: 0,
        },
        ticks: {
          opacity: 0,
        },
        grid: {
          opacity: 0,
        },
      }}
    />
  )
}
