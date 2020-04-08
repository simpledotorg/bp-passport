import React from 'react'
import {Text} from 'react-native'

import {colors} from '../styles'

export const Link = (props: any) => {
  return (
    <Text
      {...props}
      style={[
        {
          height: 20,
          fontSize: 14,
          fontWeight: '500',
          fontStyle: 'normal',
          lineHeight: 20,
          letterSpacing: 0.2,
          color: colors.blue2,
          ...props.style,
        },
      ]}
    />
  )
}
