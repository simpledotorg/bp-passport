import React, {useContext, useEffect} from 'react'
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
import BpDetailsScreen from './screens/BpDetailsScreen'
import {AuthContext, LoginState} from './providers/auth.provider'

import SCREENS from './constants/screens'
import {HomeHeaderTitle, ButtonIcon, LoadingOverlay} from './components'
import {colors, navigation as navigationStyle} from './styles'
import {BloodPressure} from './models'

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
  BP_HISTORY: {bps: BloodPressure[]}
  BP_DETAILS: {bp: BloodPressure}
}

const Stack = createStackNavigator<RootStackParamList>()

const Navigation = () => {
  return (
    <>
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
    </>
  )
}

export default Navigation

type MainStackNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.MAIN_STACK
>

type Props = {
  navigation: MainStackNavigationProp
}

function MainStack({navigation}: Props) {
  const intl = useIntl()

  const headerHeightIncludingSafeArea = useHeaderHeight()

  const {loginState} = useContext(AuthContext)

  useEffect(() => {
    if (loginState !== LoginState.LoggedOut) {
      navigation.navigate(SCREENS.HOME)
    }
  }, [loginState])

  return (
    <Stack.Navigator
      initialRouteName={
        loginState === LoginState.LoggedOut ? SCREENS.SPLASH : SCREENS.HOME
      }
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
          title: intl.formatMessage({id: 'page-titles.verify-pin'}),
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
        name={SCREENS.BP_DETAILS}
        component={BpDetailsScreen}
        options={{
          headerBackTitle: ' ',
          title: intl.formatMessage({id: 'page-titles.details'}),
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
          headerRight: () => {
            if (loginState === LoginState.LoggedIn) {
              return (
                <ButtonIcon
                  onPress={() => navigation.navigate(SCREENS.SETTINGS)}
                />
              )
            }
            return null
          },
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
