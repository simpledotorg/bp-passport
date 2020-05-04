import React, {ReactNode} from 'react'
import {
  TouchableOpacity,
  Text,
  StyleProp,
  ViewStyle,
  ButtonProps as NativeButtonProps,
  TouchableOpacityProps,
  StyleSheet,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {colors, typography} from '../styles'

interface ButtonProps extends NativeButtonProps {
  children?: ReactNode
  style?: StyleProp<ViewStyle>
  title: string
  buttonColor?: string
  disableBoxShadow?: boolean
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
        },
        props.disableBoxShadow ? {} : styles.shadowStyles,
        props.disabled
          ? {
              backgroundColor: colors.grey3,
            }
          : {},
        props.style,
      ]}>
      {props.title && (
        <Text
          style={[
            {
              fontSize: 16,
              fontWeight: 'bold',
              fontFamily: typography.FONT.base,
              fontStyle: 'normal',
              lineHeight: 20,
              letterSpacing: 1.25,
              color: props.disabled
                ? colors.grey2
                : props.buttonColor || colors.white100,
              textTransform: 'uppercase',
              textAlign: 'center',
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

const styles = StyleSheet.create({
  shadowStyles: {
    shadowColor: 'rgba(0, 0, 0, 0.2)', // iOS box shadow
    shadowOffset: {height: 2, width: 0}, // iOS box shadow
    shadowOpacity: 1, // iOS box shadow
    shadowRadius: 1, // iOS box shadow
    elevation: 3, // Android elevation,
    borderBottomColor: colors.blue4,
    borderBottomWidth: 2,
  },
})
