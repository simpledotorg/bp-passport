import React from 'react'
import {VictoryTooltip} from 'victory-native'
import {colors} from '../../styles'

export class VictoryGraphToolTipHelper {
  public static getVictoryToolTip(): any {
    return (
      <VictoryTooltip
        renderInPortal={false}
        constrainToVisibleArea={true}
        cornerRadius={20}
        pointerLength={5}
        flyoutStyle={{
          height: 32,
          padding: 200,
          fill: colors.grey0,
        }}
        style={{fill: colors.white}}
      />
    )
  }
}
