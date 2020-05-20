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

export enum ButtonType {
  Normal,
  LightBlue,
  Green,
  Delete,
}

interface ButtonProps extends NativeButtonProps {
  children?: ReactNode
  style?: StyleProp<ViewStyle>
  title: string
  buttonType?: ButtonType
  buttonUnderlayColor?: string
}

export const Button = (props: ButtonProps) => {
  let backgroundColor: string | undefined = 'red'
  let shadowColor: string | undefined = 'rgba(0, 0, 0, 0.16)'

  let underlayColour: string | undefined = '#0063C8'
  let shadowInset = {}
  let buttonTextColor: string | undefined
  let transparent = false
  /*
  if (props.buttonUnderlayColor) {
    underlayColour = props.buttonUnderlayColor
    shadowInset = styles.shadowInsetDarkBlueButton
  } else if (props.disableBoxShadow) {
    underlayColour = undefined
  } */

  if (props.disabled) {
    backgroundColor = colors.grey3
    shadowInset = styles.shadowInsetDisabledButton
  } else if (props.buttonType !== undefined) {
    switch (props.buttonType) {
      case ButtonType.Normal:
        backgroundColor = colors.blue2
        underlayColour = '#0063C8'
        shadowInset = styles.shadowInsetDarkBlueButton
        shadowColor = 'rgba(0, 0, 0, 0.16)'
        break
      case ButtonType.LightBlue:
        underlayColour = '#CBE5FF'
        shadowInset = styles.shadowInsetLightBlueButton
        buttonTextColor = colors.blue2
        backgroundColor = colors.blue3
        shadowColor = 'rgba(0, 117, 235, 0.3)'
        break
      case ButtonType.Green:
        underlayColour = '#00A742'
        shadowInset = styles.shadowInsetGreenButton
        backgroundColor = colors.green1
        shadowColor = 'rgba(0, 0, 0, 0.16)'
        break
      case ButtonType.Delete:
        underlayColour = colors.grey4
        backgroundColor = 'transparent'
        transparent = true
        buttonTextColor = colors.red1
        break
    }
  }

  return (
    <TouchableHighlight
      underlayColor={underlayColour}
      {...props}
      style={[
        {
          height: 48,
          borderRadius: 2,
          alignItems: 'center',
          justifyContent: 'center',
        },
        transparent ? {} : {...styles.shadowStyles, ...shadowInset},
        {backgroundColor, shadowColor},
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
                : buttonTextColor || colors.white100,
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
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    /* shadowOpacity: 0.16,*/
    shadowRadius: 1,
    elevation: 1, // Android elevation,
  },
  shadowInsetLightBlueButton: {
    borderBottomColor: 'rgba(0, 117, 235, 0.3)',
    borderBottomWidth: 2,
  },
  shadowInsetDarkBlueButton: {
    borderBottomColor: '#00478F',
    borderBottomWidth: 2,
  },
  shadowInsetGreenButton: {
    borderBottomColor: '#007A31',
    borderBottomWidth: 2,
  },
  shadowInsetDisabledButton: {
    borderBottomColor: '#ADB2B8',
    borderBottomWidth: 2,
  },
})
