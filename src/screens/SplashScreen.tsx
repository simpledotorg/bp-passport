import React from 'react'
import {View, Text} from 'react-native'
import {FormattedMessage} from 'react-intl'

import {containerStyles, colors} from '../styles'

function SplashScreen({navigation}: any) {
  return (
    <View
      style={[
        containerStyles.fill,
        containerStyles.centeredContent,
        {backgroundColor: colors.white},
      ]}>
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
      <View />
    </View>
  )
}

export default SplashScreen
