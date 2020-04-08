import React from 'react'
import {SafeAreaView, View, Text, Image} from 'react-native'
import {FormattedMessage} from 'react-intl'

import {containerStyles, colors, bpLogo, iconSplash} from '../styles'
import {Button, PageHeader} from '../components'
import SCREENS from '../constants/screens'

function SplashScreen({navigation}: any) {
  return (
    <SafeAreaView
      style={[containerStyles.fill, {backgroundColor: colors.white}]}>
      <View style={[containerStyles.fill, containerStyles.centeredContent]}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            borderBottomWidth: 1,
            borderBottomColor: colors.grey3,
          }}>
          <Image source={iconSplash} />
          <Image source={bpLogo} style={{width: 250, height: 35}} />
        </View>
        <View style={{flex: 2}}>
          <View>
            <PageHeader>
              <FormattedMessage id="splash.sub-title" />
            </PageHeader>
          </View>
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
      </View>
      <View
        style={[
          {
            margin: 12,
          },
        ]}>
        <Button
          title={'Go to Privacy and Policy'}
          onPress={() => {
            navigation.navigate(SCREENS.PRIVACY_POLICY)
          }}
        />
      </View>
      <View />
    </SafeAreaView>
  )
}

export default SplashScreen
