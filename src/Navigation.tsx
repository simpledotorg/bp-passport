import React from 'react'
import {View, Text} from 'react-native'
import {createStackNavigator, useHeaderHeight} from '@react-navigation/stack'
import {forFade} from './navigation/interpolators'
import {useIntl} from 'react-intl'

import LaunchScreen from './screens/LaunchScreen'
import SplashScreen from './screens/SplashScreen'
import LoginScreen from './screens/LoginScreen'
import ConsentScreen from './screens/ConsentScreen'
import ScanPassportScreen from './screens/ScanPassportScreen'
import VerifyNumberScreen from './screens/VerifyNumberScreen'
import HomeScreen from './screens/HomeScreen'

import SCREENS from './constants/screens'
import {HomeHeaderTitle, ButtonIcon} from './components'
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

  const headerHeightIncludingSafeArea = useHeaderHeight()

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
        name={SCREENS.LOGIN}
        component={LoginScreen}
        options={{
          headerBackTitle: ' ',
          title: intl.formatMessage({id: 'page-titles.login'}),
        }}
      />
      <Stack.Screen
        name={SCREENS.SCAN_BP_PASSPORT}
        component={ScanPassportScreen}
        options={{
          headerBackTitle: ' ',
          title: intl.formatMessage({id: 'page-titles.scan-bp-passport'}),
        }}
      />
      <Stack.Screen
        name={SCREENS.VERIFY_YOUR_NUMBER}
        component={VerifyNumberScreen}
        options={{
          headerBackTitle: ' ',
          title: intl.formatMessage({id: 'page-titles.verify-your-number'}),
        }}
      />
      <Stack.Screen
        name={SCREENS.HOME}
        component={HomeScreen}
        options={{
          ...navigationStyle,
          headerStyle: {
            ...navigationStyle.headerStyle,
            height: headerHeightIncludingSafeArea + 56,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitleAlign: 'center',
          headerTitle: () => <HomeHeaderTitle />,
          headerRight: () => <ButtonIcon />,
          headerLeft: () => null,
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  )
}
