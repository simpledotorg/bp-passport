import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import {forFade} from './navigation/interpolators'
import {useIntl} from 'react-intl'

import LaunchScreen from './screens/LaunchScreen'
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen'
import SplashScreen from './screens/SplashScreen'
import LoginScreen from './screens/LoginScreen'
import ConsentScreen from './screens/ConsentScreen'

import SCREENS from './constants/screens'

import {colors, navigation as navigationStyle} from './styles'

const Stack = createStackNavigator()

const Navigation = () => {
  return (
    <Stack.Navigator
      initialRouteName={SCREENS.LAUNCH}
      headerMode={'none'}
      mode="modal"
      screenOptions={{
        gestureEnabled: false,
      }}>
      <Stack.Screen name={SCREENS.LAUNCH} component={LaunchScreen} />
      <Stack.Screen
        name={SCREENS.MAIN_STACK}
        component={MainStack}
        options={{cardStyleInterpolator: forFade}}
      />
    </Stack.Navigator>
  )
}

export default Navigation

function MainStack() {
  const intl = useIntl()

  return (
    <Stack.Navigator
      initialRouteName={SCREENS.SPLASH}
      screenOptions={{
        ...navigationStyle,
        headerTintColor: colors.white100,
        gestureEnabled: true,
      }}>
      <Stack.Screen
        name={SCREENS.SPLASH}
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.CONSENT}
        component={ConsentScreen}
        options={{
          headerBackTitle: ' ',
          title: intl.formatMessage({id: 'page-titles.consent'}),
        }}
      />
      <Stack.Screen
        name={SCREENS.PRIVACY_POLICY}
        component={PrivacyPolicyScreen}
        options={{
          headerBackTitle: ' ',
          title: intl.formatMessage({id: 'page-titles.privacy-policy'}),
        }}
      />
      <Stack.Screen
        name={SCREENS.LOGIN}
        component={LoginScreen}
        options={{
          headerBackTitle: ' ',
          title: intl.formatMessage({id: 'page-titles.login'}),
        }}
      />
    </Stack.Navigator>
  )
}
