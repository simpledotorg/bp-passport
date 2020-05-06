import React, {useEffect, useState} from 'react'
import {View, TouchableWithoutFeedback, Image} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'

import {containerStyles, colors, medicineClock} from '../styles'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'

import {BodyText, BodyHeader, Button} from '../components'

import {FormattedMessage, useIntl} from 'react-intl'

type AllowNotificationsModalScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.ALLOW_NOTIFICATIONS_MODAL_SCREEN
>

type AllowNotificationsModalScreenRoute = RouteProp<
  RootStackParamList,
  SCREENS.ALLOW_NOTIFICATIONS_MODAL_SCREEN
>

type Props = {
  navigation: AllowNotificationsModalScreenNavigationProp
  route: AllowNotificationsModalScreenRoute
}

function AllowNotificationsModalScreen({navigation, route}: Props) {
  const {okCallback, cancelCallback} = route.params

  const intl = useIntl()

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.goBack()
        cancelCallback()
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
          <Image style={{alignSelf: 'center'}} source={medicineClock} />
          <BodyHeader style={{textAlign: 'center', marginBottom: 8}}>
            <FormattedMessage id="medicine.allow-notifications-title" />
          </BodyHeader>
          <BodyText style={{textAlign: 'center', marginBottom: 16}}>
            <FormattedMessage id="medicine.allow-notifications-body" />
          </BodyText>
          <Button
            style={{}}
            title={intl.formatMessage({id: 'general.ok'})}
            onPress={() => {
              navigation.pop()
              setTimeout(() => {
                okCallback()
              }, 500)
            }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default AllowNotificationsModalScreen
