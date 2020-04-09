import React, {useEffect} from 'react'
import {View, Image} from 'react-native'
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
        {backgroundColor: colors.black},
      ]}>
      <Image source={iconLaunch} />
      <View />
    </View>
  )
}

export default LaunchScreen
