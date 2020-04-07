import React from 'react'
import {SafeAreaView, View, Text} from 'react-native'
import {FormattedMessage} from 'react-intl'

import {containerStyles, colors} from '../styles'
import {Button} from '../components'
import SCREENS from '../constants/screens'

function SplashScreen({navigation}: any) {
  return (
    <SafeAreaView
      style={[containerStyles.fill, {backgroundColor: colors.white}]}>
      <View style={[containerStyles.fill, containerStyles.centeredContent]}>
        <Text>
          <FormattedMessage id="splash.title" />
        </Text>
        <Text>
          <FormattedMessage id="splash.track" />
        </Text>
        <Text>
          <FormattedMessage id="splash.talk" />
        </Text>
        <Text>
          <FormattedMessage id="splash.reminders" />
        </Text>
      </View>
      <View
        style={[
          {
            margin: 12,
          },
        ]}>
        <Button
          title={'Consent'}
          onPress={() => {
            navigation.navigate(SCREENS.CONSENT)
          }}
        />
      </View>
      <View />
    </SafeAreaView>
  )
}

export default SplashScreen
