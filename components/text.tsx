import React, { ReactNode } from 'react'
import { Text, StyleProp, TextStyle, TextProps } from 'react-native'

import { colors, typography } from '../styles'

interface Props extends TextProps {
  children?: ReactNode
  style?: StyleProp<TextStyle>
  onPress?: () => void
}

export const BodyText = (props: Props) => {
  return (
    <Text
      {...props}
      style={[
        {
          fontSize: 16,
          fontFamily: typography.FONT.base,
          fontWeight: 'normal',
          fontStyle: 'normal',
          lineHeight: 24,
          letterSpacing: 0.5,
          color: colors.grey0,
        },
        props.style,
      ]}
    />
  )
}

export const BodyHeader = (props: Props) => {
  return (
    <Text
      {...props}
      style={[
        {
          fontSize: 22,
          fontFamily: typography.FONT.base,
          fontStyle: 'normal',
          fontWeight: 'bold',
          lineHeight: 28,
          letterSpacing: 0,
          color: colors.grey0,
        },
        props.style,
      ]}
    />
  )
}
