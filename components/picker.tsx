import React from 'react'
import { StyleSheet, Platform } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import { MaterialIcons } from '@expo/vector-icons'
import { colors } from '../styles'

type Item = {
  label: string
  value: string
  // key: string;
  // color: string;
  // inputLabel: string;
}

type Props = {
  value: string
  items: Item[]
  onValueChange: (value: string) => void
}

export const Picker = ({
  value,
  items,
  onValueChange: onValueUpdate,
}: Props) => {
  const icon = () => {
    return <MaterialIcons name="expand-more" size={24} color={colors.grey1} />
  }
  return (
    <RNPickerSelect
      value={value}
      items={items}
      onValueChange={(newValue: string) => onValueUpdate(newValue)}
      placeholder={{}}
      useNativeAndroidPickerStyle={false}
      style={pickerStyles}
      // @ts-ignore
      Icon={icon}
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
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.grey3,
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  iconContainer: {
    top: Platform.OS === 'ios' ? 16 : 20,
    right: 12,
  },
})
