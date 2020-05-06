import React, {useEffect, useState} from 'react'
import {View, Image, StatusBar, TouchableWithoutFeedback} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'

import {containerStyles, colors} from '../styles'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'
import {BodyHeader, BodyText, BpModal, BsModal} from '../components'

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

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.goBack()
      }}>
      <View
        style={[
          containerStyles.fill,
          {justifyContent: 'flex-end', backgroundColor: 'transparent'},
        ]}>
        <View
          style={{
            backgroundColor: colors.white100,
            paddingBottom: 8,
            width: '100%',
            borderTopRightRadius: 4,
            borderTopLeftRadius: 4,
          }}>
          {bp && (
            <BpModal
              bp={bp}
              close={() => {
                navigation.goBack()
              }}
            />
          )}
          {bs && (
            <BsModal
              bs={bs}
              close={() => {
                navigation.goBack()
              }}
            />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default DetailsModalScreen
