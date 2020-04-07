import React from 'react'
import {Text, TextProperties} from 'react-native'

import {colors} from '../styles'

export const BodyText = (props: any) => {
  return (
    <Text
      {...props}
      style={[
        {
          fontSize: 16,
          fontWeight: 'normal',
          fontStyle: 'normal',
          lineHeight: 24,
          letterSpacing: 0.5,
          color: colors.grey0,
          ...props.style,
        },
      ]}
    />
  )
}
