import React from 'react'
import {View, ActivityIndicator} from 'react-native'
import {colors, containerStyles} from '../../styles'

export const GraphLoadingPlaceholder = () => {
  return (
    <View
      style={[
        containerStyles.fill,
        containerStyles.centeredContent,
        {height: 260},
      ]}>
      <ActivityIndicator size="large" color={colors.blue1} />
    </View>
  )
}
