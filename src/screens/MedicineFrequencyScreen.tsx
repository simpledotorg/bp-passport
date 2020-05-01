import React, {useEffect, useState} from 'react'
import {View, Image, StatusBar, TouchableWithoutFeedback} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'

import {containerStyles, colors} from '../styles'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'
import {BodyHeader} from '../components'
import {Medication} from '../redux/medication/medication.models'
import {FormattedMessage} from 'react-intl'

type MedicineFrequencyScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.DETAILS_MODAL_SCREEN
>

type MedicineFrequencyScreen = RouteProp<
  RootStackParamList,
  SCREENS.DETAILS_MODAL_SCREEN
>

type Props = {
  navigation: MedicineFrequencyScreenNavigationProp
  route: MedicineFrequencyScreen
}

function MedicineFrequencyScreen({navigation, route}: Props) {
  const medication = route.params
  const DAYS = {
    MONDAY: {
      label: 'general.monday',
      value: true,
    },
    TUESDAY: {
      label: 'general.tuesday',
      value: true,
    },
    WEDNESDAY: {
      label: 'general.wednesday',
      value: true,
    },
    THURSDAY: {
      label: 'general.thursday',
      value: true,
    },
    FRIDAY: {
      label: 'general.friday',
      value: true,
    },
    SATURDAY: {
      label: 'general.saturday',
      value: true,
    },
    SUNDAY: {
      label: 'general.sunday',
      value: true,
    },
  }

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
            padding: 16,
            width: '100%',
          }}>
          <View
            style={{
              padding: 24,
              backgroundColor: colors.white100,
            }}>
            <View
              style={{
                borderBottomWidth: 2,
                borderColor: colors.grey3,
              }}>
              <BodyHeader
                style={{
                  fontWeight: 'bold',
                  fontSize: 22,
                  marginBottom: 16,
                }}>
                <FormattedMessage id="medicine.set-reminder-for" />
              </BodyHeader>
            </View>
            {Object.keys(DAYS).map((day) => {
              console.log(day)
            })}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default MedicineFrequencyScreen
