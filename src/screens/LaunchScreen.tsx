import React, {useEffect, useState} from 'react'
import {View, Image, StatusBar} from 'react-native'
import {StackNavigationProp} from '@react-navigation/stack'

import {iconLaunch, containerStyles, colors} from '../styles'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'

type LaunchScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.LAUNCH
>

type Props = {
  navigation: LaunchScreenNavigationProp
}

function LaunchScreen({navigation}: Props) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace(SCREENS.MAIN_STACK)
    }, 2000)
  }, [])

  return (
    <View
      style={[
        containerStyles.fill,
        containerStyles.centeredContent,
        {backgroundColor: colors.blue1},
      ]}>
      <StatusBar backgroundColor={colors.blue1} barStyle="light-content" />
      <Image source={iconLaunch} />
      <View />
    </View>
  )
}

export default LaunchScreen
