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
    <View
      style={[
        containerStyles.fill,
        {
          backgroundColor: colors.grey4,
          justifyContent: 'flex-end',
        },
      ]}>
      <View
        style={[
          styles.splashContainer,
          {
            position: 'relative',
            height: '30%',
            justifyContent: 'center',
            flexDirection: 'row',
          },
        ]}>
        <Image
          source={splashImage}
          style={{position: 'absolute', bottom: '90%'}}
        />
        <View>
          <PageHeader
            style={{
              textAlign: 'center',
              marginBottom: 18,
              marginTop: '15%',
            }}>
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
    </View>
  )

  return (
    <SafeAreaView
      style={[containerStyles.fill, {backgroundColor: colors.grey4}]}>
      <StatusBar barStyle="dark-content" />
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <View style={{flex: 2, flexGrow: 1, flexShrink: 0}} />
        <View
          style={[
            styles.splashContainer,
            {
              flex: 1,
              alignItems: 'center',
              position: 'relative',
              backgroundColor: 'blue',
            },
          ]}>
          {/* <Image
            source={splashImage}
            style={{position: 'absolute', bottom: '100%'}}
          /> */}
          <PageHeader
            style={{
              textAlign: 'center',
              marginBottom: 18,
              marginTop: '20%',
              position: 'absolute',
              bottom: '100%',
              backgroundColor: 'red',
            }}>
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
    paddingHorizontal: 24,

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
