import React, {ReactNode} from 'react'
import {
  TouchableOpacity,
  TouchableHighlight,
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
  buttonUnderlayColor?: string
  disableBoxShadow?: boolean
}

export const Button = (props: ButtonProps) => {
  let underlayColour: string | undefined = '#0063C8'
  let shadowInset = {}
  if (props.buttonUnderlayColor) {
    underlayColour = props.buttonUnderlayColor
  } else if (props.disableBoxShadow) {
    underlayColour = undefined
  } else if (props.buttonColor) {
    underlayColour = '#CBE5FF'
    shadowInset = styles.shadowInset
  }
  return (
    <TouchableHighlight
      underlayColor={underlayColour}
      {...props}
      style={[
        {
          height: 48,
          borderRadius: 2,
          backgroundColor: colors.blue2,
          alignItems: 'center',
          justifyContent: 'center',
        },
        props.disableBoxShadow ? {} : {...styles.shadowStyles, ...shadowInset},
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
    </TouchableHighlight>
  )
}

interface ButtonIconProps extends TouchableOpacityProps {
  style?: StyleProp<ViewStyle>
  iconName?: string
  iconColor?: string
  iconSize?: number
}

export const ButtonIcon = (props: ButtonIconProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
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
        name={props.iconName ?? '?'}
        size={props.iconSize ?? 24}
        color={props.iconColor ?? colors.white72}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  shadowStyles: {
    shadowColor: colors.black, // iOS box shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.16,
    shadowRadius: 1,
    elevation: 2, // Android elevation,
  },
  shadowInset: {
    borderBottomColor: 'rgba(0, 117, 235, 0.3)',
    borderBottomWidth: 2,
  },
})
