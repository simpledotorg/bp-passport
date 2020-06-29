import React, {useEffect, useState} from 'react'
import {View, TouchableWithoutFeedback, Image, Platform} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'

import {containerStyles, colors, reviewStar} from '../styles'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'

import {BodyText, BodyHeader, Button, ButtonType} from '../components'

import {FormattedMessage, useIntl} from 'react-intl'

type WriteAReviewModalScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.WRITE_A_REVIEW_MODAL_SCREEN
>

type WriteAReviewModalScreenRoute = RouteProp<
  RootStackParamList,
  SCREENS.WRITE_A_REVIEW_MODAL_SCREEN
>

type Props = {
  navigation: WriteAReviewModalScreenNavigationProp
  route: WriteAReviewModalScreenRoute
}

function WriteAReviewModalScreen({navigation}: Props) {
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
            source={reviewStar}
          />
          <BodyHeader style={{textAlign: 'center', marginBottom: 8}}>
            <FormattedMessage id="write-a-review.title" />
          </BodyHeader>
          <BodyText style={{textAlign: 'center', marginBottom: 24}}>
            <FormattedMessage
              id="write-a-review.description"
              values={{
                store: (
                  <BodyText>
                    {Platform.OS === 'ios' ? (
                      <FormattedMessage id="write-a-review.apple-app-store" />
                    ) : (
                      <FormattedMessage id="write-a-review.google-play-store" />
                    )}
                  </BodyText>
                ),
              }}
            />
          </BodyText>
          <Button
            buttonType={ButtonType.Normal}
            title={intl.formatMessage({id: 'general.write-a-review'})}
            onPress={() => {
              navigation.pop()
            }}
            style={{marginBottom: 16}}
          />
          <Button
            buttonType={ButtonType.LightBlue}
            title={intl.formatMessage({id: 'general.later'})}
            onPress={() => {
              navigation.pop()
            }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default WriteAReviewModalScreen
