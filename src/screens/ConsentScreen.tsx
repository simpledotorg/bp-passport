import React from 'react'
import {SafeAreaView, View, ScrollView, StatusBar, Linking} from 'react-native'
import {FormattedMessage} from 'react-intl'

import {containerStyles, colors} from '../styles'
import {Button, Link, BodyText} from '../components'
import SCREENS from '../constants/screens'

function Consent({navigation}: any) {
  return (
    <SafeAreaView
      style={[containerStyles.fill, {backgroundColor: colors.white}]}>
      <StatusBar backgroundColor="blue" barStyle="light-content" />
      <View
        style={[
          containerStyles.fill,
          containerStyles.centeredContent,
          {margin: 24},
        ]}>
        <ScrollView>
          <BodyText style={{marginBottom: 24}}>
            <FormattedMessage id="consent.by-confirming" />
          </BodyText>
          <BodyText style={{marginBottom: 24}}>
            <FormattedMessage id="consent.personal-data" />
          </BodyText>
          <BodyText>
            <FormattedMessage
              id="consent.data-privacy"
              values={{
                here: (
                  <BodyText
                    style={{color: colors.blue2}}
                    onPress={() => {
                      Linking.openURL('https://simple.org/patient-privacy')
                    }}>
                    <FormattedMessage id="general.here" />
                  </BodyText>
                ),
                digital_principles: (
                  <BodyText
                    style={{color: colors.blue2}}
                    onPress={() => {
                      Linking.openURL(
                        'https://www.simple.org/digitalprinciples/',
                      )
                    }}>
                    <FormattedMessage id="consent.digital-principles" />
                  </BodyText>
                ),
              }}
            />
          </BodyText>
        </ScrollView>
      </View>
      <View
        style={[
          {
            margin: 12,
          },
        ]}>
        <Button
          title={<FormattedMessage id="general.i-agree" />}
          onPress={() => {
            navigation.navigate(SCREENS.LOGIN)
          }}
        />
      </View>
      <View />
    </SafeAreaView>
  )
}

export default Consent
