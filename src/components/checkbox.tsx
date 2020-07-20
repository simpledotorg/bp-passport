import React from 'react'
import {View} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

import {colors} from '../styles'

type Props = {
  checked: boolean
}

export const CheckBox = ({checked}: Props) => {
  return (
    <View
      style={{
        width: 18,
        height: 18,
        borderWidth: 2,
        borderRadius: 2,
        borderColor: colors.blue2,
        backgroundColor: checked ? colors.blue2 : colors.white100,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}>
      {checked && (
        <Icon
          name="check"
          size={16}
          style={{position: 'relative', right: 1}}
          color={colors.white100}
        />
      )}
    </View>
  )
}

export const RadioButton = ({checked}: Props) => {
  return (
    <View
      style={{
        width: 20,
        height: 20,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: checked ? colors.blue2 : '#DADADA',
        backgroundColor: colors.white100,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {checked && (
        <View
          style={{
            width: 7,
            height: 7,
            borderRadius: 3.5,
            backgroundColor: colors.blue2,
          }}
        />
      )}
    </View>
  )
}
