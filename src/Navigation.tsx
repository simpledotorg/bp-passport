import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'

import LaunchScreen from './screens/LaunchScreen'
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen'
import SplashScreen from './screens/SplashScreen'
import LoginScreen from './screens/LoginScreen'

import SCREENS from './constants/screens'

import {colors, navigation as navigationStyle} from './styles'

const Stack = createStackNavigator()

const Navigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="LaunchScreen"
      screenOptions={{
        ...navigationStyle,
        headerTintColor: colors.white100,
      }}>
      <Stack.Screen name={SCREENS.LAUNCH} component={LaunchScreen} />
      <Stack.Screen name={SCREENS.SPLASH} component={SplashScreen} />
      <Stack.Screen
        name={SCREENS.PRIVACY_POLICY}
        component={PrivacyPolicyScreen}
      />
      <Stack.Screen name={SCREENS.LOGIN} component={LoginScreen} />
    </Stack.Navigator>
  )
}

export default Navigation
