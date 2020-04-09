import React, {ReactNode} from 'react'
import {Text, StyleProp, TextStyle, TextProps} from 'react-native'

import {colors} from '../styles'

interface Props extends TextProps {
  children?: ReactNode
  style?: StyleProp<TextStyle>
}

export const BodyText = (props: Props) => {
  return (
    <Text
      style={[
        {
          fontSize: 16,
          fontWeight: 'normal',
          fontStyle: 'normal',
          lineHeight: 24,
          letterSpacing: 0.5,
          color: colors.grey0,
        },
        props.style,
      ]}
      {...props}
    />
  )
}

export const BodyHeader = (props: Props) => {
  return (
    <Text
      style={[
        {
          fontSize: 18,
          fontWeight: '500',
          fontStyle: 'normal',
          lineHeight: 28,
          letterSpacing: 0,
          color: colors.grey0,
        },
        props.style,
      ]}
      {...props}
    />
  )
}
