import React, {ReactNode} from 'react'
import {Text, StyleProp, ViewStyle, TextStyle} from 'react-native'

import {colors} from '../styles'

interface IPropsBodyText {
  style?: StyleProp<TextStyle>
  children?: ReactNode
  onPress?: () => any
}

export const BodyText = (props: IPropsBodyText) => {
  return (
    <Text
      onPress={props.onPress}
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
      ]}>
      {props.children}
    </Text>
  )
}

interface IPropsBodyHeader {
  style?: StyleProp<TextStyle>
  children?: ReactNode
}

export const BodyHeader = (props: IPropsBodyHeader) => {
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
      ]}>
      {props.children}
    </Text>
  )
}
