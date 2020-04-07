import React from 'react'
import {SafeAreaView, View, StatusBar, Text} from 'react-native'
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
        <BodyText style={{marginBottom: 24}}>
          <FormattedMessage id="consent.by_confirming" />
        </BodyText>
        <BodyText style={{marginBottom: 24}}>
          <FormattedMessage id="consent.personal_data" />
        </BodyText>
        <BodyText>
          <FormattedMessage
            id="consent.data_privacy"
            values={{
              here: (
                <BodyText style={{color: colors.blue2}}>
                  <FormattedMessage id="consent.here" />
                </BodyText>
              ),
              digital_principles: (
                <BodyText style={{color: colors.blue2}}>
                  <FormattedMessage id="consent.digital_principles" />
                </BodyText>
              ),
            }}
          />
        </BodyText>
      </View>
      <View
        style={[
          {
            margin: 12,
          },
        ]}>
        <Button
          title={<FormattedMessage id="consent.i_agree" />}
          onPress={() => {
            navigation.navigate(SCREENS.PRIVACY_POLICY)
          }}
        />
      </View>
      <View />
    </SafeAreaView>
  )
}

export default Consent
