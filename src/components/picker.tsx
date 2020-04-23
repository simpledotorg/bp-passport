import React from 'react'
import {StyleSheet, Platform} from 'react-native'
import PickerSelect, {Item} from 'react-native-picker-select'
import Icon from 'react-native-vector-icons/MaterialIcons'

import {colors} from '../styles'

type Props = {
  value: string
  items: Item[]
  onValueChange: (value: string) => void
}

export const Picker = ({value, items, onValueChange: onValueUpdate}: Props) => {
  return (
    <PickerSelect
      value={value}
      items={items}
      onValueChange={(newValue: string) => onValueUpdate(newValue)}
      placeholder={{}}
      useNativeAndroidPickerStyle={false}
      style={pickerStyles}
      Icon={() => <Icon name="expand-more" size={24} color={colors.grey1} />}
    />
  )
}

const pickerStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.grey3,
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.grey3,
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  iconContainer: {
    top: Platform.OS === 'ios' ? 16 : 15,
    right: 12,
  },
})
