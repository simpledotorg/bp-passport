import React, {ReactNode} from 'react'
import {
  TouchableOpacity,
  Text,
  StyleProp,
  ViewStyle,
  View,
  ButtonProps as NativeButtonProps,
  TouchableOpacityProps,
  StyleSheet,
  TextStyle,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {colors, typography} from '../styles'

export enum ButtonType {
  Normal = 'normal',
  Light = 'light',
  NoBackground = 'nobackground',
}

interface ButtonProps extends NativeButtonProps {
  children?: ReactNode
  style?: StyleProp<ViewStyle>
  title: string
  buttonColor?: string
  buttonType: ButtonType
}

export const Button = (props: ButtonProps) => {
  const backgroundStyle: ViewStyle = {}
  const textStyle: TextStyle = {}
  const innerStyle: ViewStyle = {}
  /*
  color: props.disabled
  ? colors.grey2
  : props.buttonColor || colors.white100, */

  switch (props.buttonType) {
    case ButtonType.Normal:
      backgroundStyle.backgroundColor = colors.blue2
      textStyle.color = colors.white100

      break
    case ButtonType.Light:
      backgroundStyle.backgroundColor = colors.blue3
      textStyle.color = colors.blue2
      innerStyle.backgroundColor = colors.blue2
      innerStyle.opacity = 0.3
      break
    case ButtonType.NoBackground:
      break
  }
  if (props.disabled) {
    textStyle.color = colors.grey2
  }
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.8}
      style={[
        {
          height: 48,
          flex: 1,
        },
        props.style,
      ]}>
      <View
        style={{
          flex: 1,
        }}>
        <View
          style={[
            {
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2,
              ...backgroundStyle,
              marginBottom: 4,
            },
            props.buttonType === ButtonType.NoBackground
              ? {}
              : styles.shadowStyles,
            props.disabled
              ? {
                  backgroundColor: colors.grey3,
                }
              : {},
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
                  /*color: props.disabled
                ? colors.grey2
                : props.buttonColor || colors.white100,*/
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  ...textStyle,
                },
              ]}>
              {props.title}
            </Text>
          )}
        </View>
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            borderBottomLeftRadius: 2,
            borderBottomEndRadius: 2,
            ...innerStyle,
          }}
        />
      </View>
    </TouchableOpacity>
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
    /*
    shadowColor: 'rgba(0,0,0, 0.32)', // iOS box shadow
    shadowOffset: {height: 1, width: 1}, // iOS box shadow
    shadowOpacity: 1, // iOS box shadow
    shadowRadius: 1, // iOS box shadow
    elevation: 2, // Android elevation,*/
  },
})

/*
background: #E0F0FF;
box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.04), 0px 2px 1px rgba(0, 0, 0, 0.16), inset 0px -2px 0px rgba(0, 117, 235, 0.3);
border-radius: 2px;
*/
