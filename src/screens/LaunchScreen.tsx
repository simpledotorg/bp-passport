import React, {useEffect, useState} from 'react'
import {View, Image} from 'react-native'
import {StackNavigationProp} from '@react-navigation/stack'
import AsyncStorage from '@react-native-community/async-storage'

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

const SPLASH_MINIMUM_TIME = 2000

function LaunchScreen({navigation}: Props) {
  const [token, setToken] = useState<string | null>(null)
  const [hasLoadedToken, setHasLoadedToken] = useState<boolean>(false)
  const [timeoutComplete, setTimeoutComplete] = useState<boolean>(false)

  const getUserId = async () => {
    return new Promise<string | null>((resolve, reject) => {
      AsyncStorage.getItem('token')
        .then((response: string | null) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  useEffect(() => {
    getUserId()
      .then((token: string | null) => {
        setToken(token)
      })
      .catch((error) => {
        console.log('Error loading token:', error)
      })
      .finally(() => {
        setHasLoadedToken(true)
      })
    setTimeout(() => {
      setTimeoutComplete(true)
    }, SPLASH_MINIMUM_TIME)
  }, [])

  useEffect(() => {
    if (hasLoadedToken && timeoutComplete) {
      navigation.replace(SCREENS.MAIN_STACK, {token})
    }
  }, [token, hasLoadedToken, timeoutComplete])

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
