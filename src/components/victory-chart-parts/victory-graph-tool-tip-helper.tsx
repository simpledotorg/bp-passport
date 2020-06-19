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

  public static getEventHandlers(): any {
    return [
      {
        target: 'data',
        eventHandlers: {
          onPressIn: () => {
            return [
              {
                target: 'data',
                mutation: () => ({
                  style: {
                    stroke: colors.blue2,
                    strokeWidth: 3,
                    fill: colors.white,
                    boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)',
                  },
                }),
              },
              {
                target: 'labels',
                mutation: () => ({active: true}),
              },
            ]
          },
          onPressOut: () => {
            return [
              {
                target: 'data',
                mutation: () => {},
              },
              {
                target: 'labels',
                mutation: () => ({active: false}),
              },
            ]
          },
        },
      },
    ]
  }
}
