import React, {ReactNode} from 'react'
import {
  TouchableOpacity,
  Text,
  StyleProp,
  ViewStyle,
  ButtonProps as NativeButtonProps,
  TouchableOpacityProps,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import colors from '../styles/colors'

interface ButtonProps extends NativeButtonProps {
  children?: ReactNode
  style?: StyleProp<ViewStyle>
  title: string
}

export const Button = (props: ButtonProps) => {
  return (
    <TouchableOpacity
      {...props}
      style={[
        {
          height: 48,
          borderRadius: 2,
          backgroundColor: colors.blue2,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: 'rgba(0,0,0, 0.8)', // iOS box shadow
          shadowOffset: {height: 1, width: 1}, // iOS box shadow
          shadowOpacity: 1, // iOS box shadow
          shadowRadius: 1, // iOS box shadow
          elevation: 2, // Android elevation
        },
        props.style,
      ]}>
      {props.title && (
        <Text
          style={[
            {
              fontSize: 16,
              fontWeight: '500',
              fontStyle: 'normal',
              lineHeight: 20,
              letterSpacing: 1.25,
              color: colors.white100,
              textTransform: 'uppercase',
            },
          ]}>
          {props.title}
        </Text>
      )}
    </TouchableOpacity>
  )
}

interface ButtonIconProps extends TouchableOpacityProps {
  style?: StyleProp<ViewStyle>
  iconColor?: string
  iconSize?: number
}

export const ButtonIcon = (props: ButtonIconProps) => {
  return (
    <TouchableOpacity
      {...props}
      style={[
        {
          width: 44,
          height: 44,
          alignItems: 'center',
          justifyContent: 'center',
        },
        props.style,
      ]}>
      <Icon
        name="settings"
        size={props.iconSize ?? 24}
        color={props.iconColor ?? colors.white72}
      />
    </TouchableOpacity>
  )
}
