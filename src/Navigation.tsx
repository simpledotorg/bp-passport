import React, {useContext, useEffect} from 'react'
import {Alert} from 'react-native'
import {
  createStackNavigator,
  useHeaderHeight,
  StackNavigationProp,
} from '@react-navigation/stack'
import {useNavigationState} from '@react-navigation/native'
import {forFade} from './navigation/interpolators'
import {useIntl} from 'react-intl'
import {usePrevious} from './effects/use-previous.effect'

import LaunchScreen from './screens/LaunchScreen'
import SplashScreen from './screens/SplashScreen'
import LoginScreen from './screens/LoginScreen'
import ConsentScreen from './screens/ConsentScreen'
import ScanPassportScreen from './screens/ScanPassportScreen'
import VerifyNumberScreen from './screens/VerifyNumberScreen'
import HomeScreen from './screens/HomeScreen'
import AddBpScreen from './screens/AddBpScreen'
import BpHistoryScreen from './screens/BpHistoryScreen'
import BpDetailsScreen from './screens/BpDetailsScreen'
import SettingsScreen from './screens/SettingsScreen'
import BsDetailsScreen from './screens/BsDetailsScreen'
import BsHistoryScreen from './screens/BsHistoryScreen'
import AddBsScreen from './screens/AddBsScreen'
import AddMedicineScreen from './screens/AddMedicineScreen'

import SCREENS from './constants/screens'
import {HomeHeaderTitle, ButtonIcon, LoadingOverlay} from './components'
import {colors, navigation as navigationStyle} from './styles'
import {BloodPressure} from './redux/blood-pressure/blood-pressure.models'
import {BloodSugar} from './redux/blood-sugar/blood-sugar.models'
import {LoginState} from './redux/auth/auth.models'
import {loginStateSelector} from './redux/auth/auth.selectors'
import {patientSelector} from './redux/patient/patient.selectors'

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
  ADD_BP: undefined
  ADD_BS: undefined
  BS_HISTORY: {bloodSugars: BloodSugar[]}
  BS_DETAILS: {bs: BloodSugar}
  ADD_MEDICINE: undefined
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

  const loginState = loginStateSelector()
  const prevLoginState = usePrevious(loginState)
  const apiUser = patientSelector()

  const mainStackRoutes = useNavigationState(
    (state) => state.routes[state.index],
  )
  const routeCount = mainStackRoutes.state?.routes.length ?? 1

  useEffect(() => {
    if (loginState === LoginState.LoggedOut) {
      if (
        prevLoginState === LoginState.LoggedIn ||
        prevLoginState === LoginState.LoggingIn
      ) {
        Alert.alert(
          'Signed out',
          "Sorry, you've been signed out as your token expired.",
          [
            {
              text: intl.formatMessage({id: 'general.ok'}),
            },
          ],
          {cancelable: true},
        )

        if (routeCount <= 1) {
          navigation.replace(SCREENS.SPLASH)
        } else {
          navigation.popToTop()
        }
      }
    } else {
      if (prevLoginState === LoginState.LoggedOut) {
        navigation.navigate(SCREENS.HOME)
      }
    }
  }, [loginState])

  useEffect(() => {}, [apiUser])

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
        name={SCREENS.ADD_BP}
        component={AddBpScreen}
        options={{
          headerBackTitle: ' ',
          title: intl.formatMessage({id: 'page-titles.new-bp'}),
        }}
      />
      <Stack.Screen
        name={SCREENS.ADD_BS}
        component={AddBsScreen}
        options={{
          headerBackTitle: ' ',
          title: intl.formatMessage({id: 'page-titles.new-bs'}),
        }}
      />
      <Stack.Screen
        name={SCREENS.BS_HISTORY}
        component={BsHistoryScreen}
        options={{
          headerBackTitle: ' ',
          title: intl.formatMessage({id: 'page-titles.all-bs'}),
        }}
      />
      <Stack.Screen
        name={SCREENS.BS_DETAILS}
        component={BsDetailsScreen}
        options={{
          headerBackTitle: ' ',
          title: intl.formatMessage({id: 'page-titles.details'}),
        }}
      />
      <Stack.Screen
        name={SCREENS.ADD_MEDICINE}
        component={AddMedicineScreen}
        options={{
          headerBackTitle: ' ',
          title: intl.formatMessage({id: 'page-titles.add-medicine'}),
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
            if (
              loginState === LoginState.LoggedIn ||
              (loginState === LoginState.LoggingIn && apiUser !== undefined)
            ) {
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
