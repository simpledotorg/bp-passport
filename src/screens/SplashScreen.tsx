import React from 'react'
import {SafeAreaView, View, Text, Image} from 'react-native'
import {FormattedMessage} from 'react-intl'
import Icon from 'react-native-vector-icons/MaterialIcons'

import {containerStyles, colors, iconSplash, bpLogo} from '../styles'
import {Button, PageHeader, BodyHeader, BodyText} from '../components'
import SCREENS from '../constants/screens'

function SplashScreen({navigation}: any) {
  return (
    <SafeAreaView
      style={[containerStyles.fill, {backgroundColor: colors.white}]}>
      <View
        style={[
          containerStyles.fill,
          containerStyles.centeredContent,
          {margin: 24, justifyContent: 'flex-start', alignItems: 'flex-start'},
        ]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: 24,
            paddingBottom: 24,
            width: '100%',
            borderBottomColor: colors.grey3,
            borderBottomWidth: 1,
            marginBottom: 24,
          }}>
          <Image
            source={iconSplash}
            style={{width: 32, height: 32, flexShrink: 0, marginRight: 14}}
          />
          <Image
            source={bpLogo}
            style={{height: 32, resizeMode: 'contain', marginTop: 5}}
          />
        </View>
        <BodyHeader>
          <FormattedMessage id="splash.sub-title" />
        </BodyHeader>
        <View style={{width: '90%'}}>
          <View
            style={{
              marginTop: 24,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Icon name="edit" size={24} />
            <BodyText style={{marginLeft: 16}}>
              <FormattedMessage id="splash.track" />
            </BodyText>
          </View>
          <View
            style={{
              marginTop: 24,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Icon name="record-voice-over" size={24} />
            <BodyText style={{marginLeft: 16}}>
              <FormattedMessage id="splash.talk" />
            </BodyText>
          </View>
          <View
            style={{
              marginTop: 24,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Icon name="local-pharmacy" size={24} />
            <BodyText style={{marginLeft: 16}}>
              <FormattedMessage id="splash.medicine" />
            </BodyText>
          </View>
          <View
            style={{
              marginTop: 24,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Icon name="alarm" size={24} />
            <BodyText style={{marginLeft: 16}}>
              <FormattedMessage id="splash.reminders" />
            </BodyText>
          </View>
        </View>
        <Button
          style={{width: '100%', marginTop: 24}}
          title={<FormattedMessage id="general.next" />}
          onPress={() => {
            navigation.navigate(SCREENS.CONSENT)
          }}
        />
      </View>
    </SafeAreaView>
  )
}

export default SplashScreen
