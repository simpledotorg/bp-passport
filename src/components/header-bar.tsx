import React from 'react'
import {View, Text} from 'react-native'

import {colors} from '../styles'

export const HeaderBar = (props: any) => {
  return (
    <View
      style={[
        {
          width: '100%',
          height: 60,
          backgroundColor: colors.blue1,
          justifyContent: 'center',
        },
      ]}
      {...props}
    />
  )
}

export const HeaderBarText = (props: any) => {
  return (
    <Text
      style={[
        {
          fontSize: 20,
          fontWeight: '500',
          fontStyle: 'normal',
          lineHeight: 28,
          letterSpacing: 0.2,
          color: colors.white100,
          marginLeft: 16,
        },
      ]}
      {...props}
    />
  )
}
