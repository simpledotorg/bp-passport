import React, {useEffect} from 'react'
import {
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native'
import {FormattedMessage, useIntl, IntlContext} from 'react-intl'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {StackNavigationProp} from '@react-navigation/stack'

import {containerStyles, colors, iconSplash, bpLogo} from '../styles'
import {Button, BodyHeader, BodyText} from '../components'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.SPLASH
>

type Props = {
  navigation: SplashScreenNavigationProp
}

function SplashScreen({navigation}: Props) {
  const intl = useIntl()

  return (
    <SafeAreaView
      style={[containerStyles.fill, {backgroundColor: colors.white}]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Image source={iconSplash} style={{marginRight: 14}} />
            <Image
              source={bpLogo}
              style={{height: 20, resizeMode: 'contain', marginTop: 5}}
            />
          </View>

          <BodyHeader>
            <FormattedMessage id="splash.in-this-app" />
          </BodyHeader>

          <View>
            <View
              style={{
                marginTop: 24,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Icon name="edit" size={24} color={colors.grey2} />
              <BodyText style={styles.itemText}>
                <FormattedMessage id="splash.record-and-track" />
              </BodyText>
            </View>
            <View style={styles.item}>
              <Icon name="record-voice-over" size={24} color={colors.grey2} />
              <BodyText style={styles.itemText}>
                <FormattedMessage id="splash.video-consult-bp" />
              </BodyText>
            </View>
            <View style={styles.item}>
              <Icon name="local-pharmacy" size={24} color={colors.grey2} />
              <BodyText style={styles.itemText}>
                <FormattedMessage id="splash.video-consult-medicine" />
              </BodyText>
            </View>
            <View style={styles.item}>
              <Icon name="alarm" size={24} color={colors.grey2} />
              <BodyText style={styles.itemText}>
                <FormattedMessage id="splash.get-reminders" />
              </BodyText>
            </View>
          </View>
          <Button
            style={{marginTop: 24}}
            title={intl.formatMessage({id: 'general.next'})}
            onPress={() => {
              navigation.navigate(SCREENS.LOGIN)
            }}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  content: {margin: 24},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomColor: colors.grey3,
    borderBottomWidth: 1,
    marginBottom: 24,
  },
  item: {marginTop: 24, flexDirection: 'row', alignItems: 'center'},
  itemText: {marginLeft: 16, flex: 1},
})
