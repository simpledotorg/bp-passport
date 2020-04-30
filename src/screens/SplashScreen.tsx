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

import {containerStyles, colors, splashImage} from '../styles'
import {Button, PageHeader, BodyText} from '../components'
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
      style={[containerStyles.fill, {backgroundColor: colors.grey4}]}>
      <StatusBar barStyle="dark-content" />
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <View style={[styles.splashContainer, {alignItems: 'center'}]}>
          <Image source={splashImage} style={{}} />
          <PageHeader style={{textAlign: 'center', marginBottom: 18}}>
            <FormattedMessage id="splash.track-bp-bs-meds" />
          </PageHeader>

          <Button
            style={[styles.primaryButton]}
            buttonColor={colors.blue2}
            title={intl.formatMessage({id: 'general.next'})}
            onPress={() => {
              navigation.navigate(SCREENS.LOGIN)
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default SplashScreen

const styles = {
  splashContainer: {
    backgroundColor: colors.white100,
    borderRadius: 4,
    flexShrink: 0,
    padding: 24,

    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  primaryButton: {
    backgroundColor: colors.blue3,
    shadowColor: 'rgba(0, 117, 235, 0.3)',
    width: '100%',
  },
}
