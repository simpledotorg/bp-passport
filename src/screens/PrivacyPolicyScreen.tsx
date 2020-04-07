import React from 'react'
import {SafeAreaView, View, StatusBar} from 'react-native'

import {containerStyles, colors} from '../styles'
import {Button} from '../components'
import SCREENS from '../constants/screens'

function PrivacyPolicy({navigation}: any) {
  return (
    <SafeAreaView
      style={[containerStyles.fill, {backgroundColor: colors.white}]}>
      <StatusBar backgroundColor="blue" barStyle="light-content" />
      <View
        style={[containerStyles.fill, containerStyles.centeredContent]}></View>
      <View
        style={[
          {
            margin: 12,
          },
        ]}>
        <Button
          title={'Go to Login'}
          onPress={() => {
            navigation.navigate(SCREENS.LOGIN)
          }}
        />
      </View>
      <View />
    </SafeAreaView>
  )
}

export default PrivacyPolicy
