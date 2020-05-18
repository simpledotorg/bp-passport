import React from 'react'
import {SafeAreaView, View, ScrollView, StatusBar, Linking} from 'react-native'
import {FormattedMessage, useIntl} from 'react-intl'
import {StackNavigationProp} from '@react-navigation/stack'

import {containerStyles, colors} from '../styles'
import {Button, Link, BodyText} from '../components'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'
import {loginNoApi} from '../redux/auth/auth.actions'
import {useDispatch} from 'react-redux'

type ConsentScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.CONSENT
>

type Props = {
  navigation: ConsentScreenNavigationProp
}

function Consent({navigation}: Props) {
  const intl = useIntl()

  const dispatch = useDispatch()

  return (
    <SafeAreaView
      style={[containerStyles.fill, {backgroundColor: colors.blue3}]}>
      <StatusBar backgroundColor={colors.blue1} barStyle="light-content" />
      <View style={[containerStyles.fill, {backgroundColor: colors.white}]}>
        <View
          style={[
            containerStyles.fill,
            containerStyles.centeredContent,
            {margin: 24, backgroundColor: colors.white},
          ]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <BodyText style={{marginBottom: 24}}>
              <FormattedMessage id="consent.using-this-app" />
            </BodyText>
            <BodyText style={{marginBottom: 24}}>
              <FormattedMessage id="consent.any-data-stored" />
            </BodyText>
            <BodyText style={{marginBottom: 24}}>
              <FormattedMessage
                id="consent.more-information"
                values={{
                  here: (
                    <BodyText
                      style={{color: colors.blue2}}
                      onPress={() => {
                        Linking.openURL('https://simple.org/patient-privacy')
                      }}>
                      <FormattedMessage id="consent.here-link" />
                    </BodyText>
                  ),
                }}
              />
            </BodyText>
          </ScrollView>
        </View>
        <View
          style={{
            padding: 8,
            backgroundColor: colors.blue3,
          }}>
          <Button
            title={intl.formatMessage({id: 'general.i-agree'})}
            onPress={() => {
              dispatch(loginNoApi())
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Consent
