import React from 'react'
import {View} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'

import {containerStyles, colors} from '../styles'
import {HeaderBar, HeaderBarText, Button} from '../components'
import SCREENS from '../constants/screens'

function PrivacyPolicy({navigation}: any) {
  return (
    <SafeAreaView
      style={[containerStyles.fill, {backgroundColor: colors.white}]}>
      <HeaderBar>
        <HeaderBarText>Privacy Policy</HeaderBarText>
      </HeaderBar>
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
