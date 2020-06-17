import React, {useEffect, useState} from 'react'
import {View, TouchableWithoutFeedback, Image} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'

import {containerStyles, colors, largeWarningSign} from '../styles'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'

import {BodyText, BodyHeader, Button, ButtonType} from '../components'

import {FormattedMessage, useIntl} from 'react-intl'

type AddDataWarningModalScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.ADD_DATA_WARNING_MODAL_SCREEN
>

type AddDataWarningModalScreenRoute = RouteProp<
  RootStackParamList,
  SCREENS.ADD_DATA_WARNING_MODAL_SCREEN
>

type Props = {
  navigation: AddDataWarningModalScreenNavigationProp
  route: AddDataWarningModalScreenRoute
}

function AddDataWarningModalScreen({navigation, route}: Props) {
  const {displayText} = route.params
  const intl = useIntl()

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.goBack()
      }}>
      <View
        style={[
          containerStyles.fill,
          {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
          },
        ]}>
        <View
          style={[
            containerStyles.containerSegment,
            {
              backgroundColor: colors.white100,
              padding: 24,
              width: 265,
            },
          ]}>
          <Image
            style={{alignSelf: 'center', marginTop: 2, marginBottom: 30}}
            source={largeWarningSign}
          />
          <BodyHeader style={{textAlign: 'center', marginBottom: 8}}>
            <FormattedMessage id="alert.title" />
          </BodyHeader>
          <BodyText style={{textAlign: 'center', marginBottom: 24}}>
            {displayText}
          </BodyText>
          <Button
            buttonType={ButtonType.Normal}
            title={intl.formatMessage({id: 'general.ok'})}
            onPress={() => {
              navigation.pop()
            }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default AddDataWarningModalScreen
