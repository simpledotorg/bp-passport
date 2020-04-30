import React, {useEffect, useState} from 'react'
import {View, Image, StatusBar, TouchableWithoutFeedback} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'

import {containerStyles, colors} from '../styles'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'
import {BodyHeader, BodyText, BpModal} from '../components'

type DetailsModalScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.DETAILS_MODAL_SCREEN
>

type DetailsModalScreen = RouteProp<
  RootStackParamList,
  SCREENS.DETAILS_MODAL_SCREEN
>

type Props = {
  navigation: DetailsModalScreenNavigationProp
  route: DetailsModalScreen
}

function DetailsModalScreen({navigation, route}: Props) {
  const {bp, bs} = route.params

  console.log(bp)
  console.log(bs)

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.goBack()
      }}>
      <View style={[containerStyles.fill, {justifyContent: 'flex-end'}]}>
        <View
          style={{
            backgroundColor: colors.white100,
            padding: 16,
            width: '100%',
          }}>
          {bp && (
            <BpModal
              bp={bp}
              close={() => {
                navigation.goBack()
              }}
            />
          )}
          {/* {bs && <BsModal bs={bs} />} */}
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default DetailsModalScreen
