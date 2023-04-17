import React from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

import { containerStyles, colors } from '../styles'
import SCREENS from '../constants/screens'
import { RootStackParamList } from '../navigation/Navigation'
import { BpModal, BsModal } from '../components'
import { BloodSugarUnitSelector } from '../redux/patient/patient.selectors'

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

function DetailsModalScreen({ navigation, route }: Props) {
  const { bp, bs } = route.params
  const displayUnits = BloodSugarUnitSelector()

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.goBack()
      }}
    >
      <View
        style={[
          containerStyles.fill,
          { justifyContent: 'flex-end', backgroundColor: 'transparent' },
        ]}
      >
        <View
          style={{
            backgroundColor: colors.white100,
            padding: 0,
            width: '100%',
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }}
        >
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
              displayUnits={displayUnits}
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
