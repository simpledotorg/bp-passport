import React from 'react'
import {
  createStackNavigator,
  useHeaderHeight,
  StackNavigationProp,
} from '@react-navigation/stack'
import {RouteProp} from '@react-navigation/native'
import {forFade} from './navigation/interpolators'
import {useIntl} from 'react-intl'

import LaunchScreen from './screens/LaunchScreen'
import SplashScreen from './screens/SplashScreen'
import LoginScreen from './screens/LoginScreen'
import ConsentScreen from './screens/ConsentScreen'
import ScanPassportScreen from './screens/ScanPassportScreen'
import VerifyNumberScreen from './screens/VerifyNumberScreen'
import BpHistoryScreen from './screens/BpHistoryScreen'
import HomeScreen from './screens/HomeScreen'
import SettingsScreen from './screens/SettingsScreen'

import SCREENS from './constants/screens'
import {HomeHeaderTitle, ButtonIcon} from './components'
import {colors, navigation as navigationStyle} from './styles'

export type RootStackParamList = {
  LAUNCH: undefined
  MAIN_STACK: undefined
  SPLASH: undefined
  LOGIN: undefined
  CONSENT: undefined
  SCAN_BP_PASSPORT: undefined
  VERIFY_YOUR_NUMBER: {passport_id: string}
  ALL_BP: undefined
  SETTINGS: undefined
  CONTACT_A_DOCTOR: undefined
  HOME: undefined
  BP_HISTORY: {bps: object[]}
}

const Stack = createStackNavigator<RootStackParamList>()

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
      initialRouteName={SCREENS.SETTINGS}
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
        name={SCREENS.BP_HISTORY}
        component={BpHistoryScreen}
        options={{
          headerBackTitle: ' ',
          title: intl.formatMessage({id: 'page-titles.all-bp'}),
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
          headerRight: () => (
            <ButtonIcon onPress={() => navigation.navigate(SCREENS.SETTINGS)} />
          ),
          headerLeft: () => null,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={SCREENS.SETTINGS}
        component={SettingsScreen}
        options={{
          headerBackTitle: ' ',
          title: intl.formatMessage({id: 'page-titles.settings'}),
        }}
      />
    </Stack.Navigator>
  )
}
