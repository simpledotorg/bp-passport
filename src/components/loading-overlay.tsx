import React from 'react'
import {View, ActivityIndicator} from 'react-native'

import {colors} from '../styles'

export const LoadingOverlay = () => {
  return (
    <View
      style={{
        backgroundColor: colors.white100,
        padding: 24,
        width: 200,
        height: 200,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator size="large" color={colors.blue2} />
    </View>
  )
}
