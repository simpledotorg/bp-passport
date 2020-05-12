import React, {useState, useEffect} from 'react'
import {Alert, Platform, AppState} from 'react-native'
import {
  createStackNavigator,
  useHeaderHeight,
  StackNavigationProp,
} from '@react-navigation/stack'
import {useNavigationState, StackActions} from '@react-navigation/native'
import {CommonActions} from '@react-navigation/native'
import {forFade} from './navigation/interpolators'
import {CardStyleInterpolators} from '@react-navigation/stack'
import {useIntl, FormattedMessage} from 'react-intl'
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
import SettingsScreen from './screens/SettingsScreen'
import BsHistoryScreen from './screens/BsHistoryScreen'
import AddBsScreen from './screens/AddBsScreen'
import AddMedicineScreen from './screens/AddMedicineScreen'
import DetailsModalScreen from './screens/DetailsModalScreen'
import MedicationDetailScreen from './screens/MedicationDetailScreen'
import MedicationFrequencyScreen from './screens/MedicineFrequencyScreen'
import MedicationTimeScreen from './screens/MedicationTimeScreen'
import AllowNotificationsModalScreen from './screens/AllowNotificationsModalScreen'

import SCREENS from './constants/screens'
import {
  HomeHeaderTitle,
  ButtonIcon,
  LoadingOverlay,
  BodyHeader,
  BodyText,
} from './components'
import {colors, navigation as navigationStyle} from './styles'
import {BloodPressure} from './redux/blood-pressure/blood-pressure.models'
import {BloodSugar} from './redux/blood-sugar/blood-sugar.models'
import {Medication, Reminder} from './redux/medication/medication.models'
import {LoginState, PassportLinkedState} from './redux/auth/auth.models'
import {
  loginStateSelector,
  passportLinkedStateSelector,
} from './redux/auth/auth.selectors'
import {patientSelector} from './redux/patient/patient.selectors'

import PushNotificationIOS from '@react-native-community/push-notification-ios'
import PushNotificationAndroid from 'react-native-push-notification'
import {useDispatch} from 'react-redux'
import {
  setPushNotificationPermission,
  setDevicePushToken,
} from './redux/notifications/notifications.actions'
import {Permission} from './redux/notifications/notifications.models'
import {pushNotificationPermissionSelector} from './redux/notifications/notifications.selectors'

export type RootStackParamList = {
  LAUNCH: undefined
  MAIN_STACK: undefined
  SCAN_STACK: undefined
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
  ADD_BP: undefined
  ADD_BS: undefined
  BS_HISTORY: {bloodSugars: BloodSugar[]}
  ADD_MEDICINE: undefined
  DETAILS_MODAL_SCREEN: {bp?: BloodPressure; bs?: BloodSugar}
  MEDICATION_DETAILS: {medication: Medication; isEditing: boolean}
  MEDICATION_FREQUENCY: {
    updateDays: (days: string) => void
    reminder: Reminder
  }
  MEDICATION_TIME: {
    updateDayOffset: (dayOffset: number) => void
    reminder: Reminder
  }
  ALLOW_NOTIFICATIONS_MODAL_SCREEN: {
    okCallback: () => void
    cancelCallback: () => void
  }
}

const Stack = createStackNavigator<RootStackParamList>()

const Navigation = () => {
  const intl = useIntl()

  const getModalOptions = () => {
    return Platform.OS === 'ios'
      ? {
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
          cardOverlayEnabled: true,
        }
      : {
          cardStyleInterpolator:
            CardStyleInterpolators.forRevealFromBottomAndroid,
        }
  }
  return (
    <>
      <Stack.Navigator
        initialRouteName={SCREENS.LAUNCH}
        headerMode={'none'}
        mode="modal"
        screenOptions={{
          gestureEnabled: false,
          cardStyle: {backgroundColor: 'rgba(47, 54, 61, 0.0)'},
          animationEnabled: true,
        }}>
        <Stack.Screen name={SCREENS.LAUNCH} component={LaunchScreen} />
        <Stack.Screen
          name={SCREENS.DETAILS_MODAL_SCREEN}
          component={DetailsModalScreen}
          options={getModalOptions()}
        />
        <Stack.Screen
          name={SCREENS.ALLOW_NOTIFICATIONS_MODAL_SCREEN}
          component={AllowNotificationsModalScreen}
          options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forModalPresentationIOS,
            cardOverlayEnabled: true,
          }}
        />
        <Stack.Screen
          name={SCREENS.MEDICATION_FREQUENCY}
          component={MedicationFrequencyScreen}
          options={getModalOptions()}
        />
        <Stack.Screen
          name={SCREENS.MEDICATION_TIME}
          component={MedicationTimeScreen}
          options={getModalOptions()}
        />
        <Stack.Screen
          name={SCREENS.MAIN_STACK}
          component={MainStack}
          options={{cardStyleInterpolator: forFade}}
        />
        <Stack.Screen
          name={SCREENS.SCAN_STACK}
          component={ScanStack}
          options={
            {
              /*cardStyleInterpolator: forFade,*/
            }
          }
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
  const [appState, setAppState] = useState(AppState.currentState)
  const dispatch = useDispatch()
  const pushNotificationPermission = pushNotificationPermissionSelector()
  const navigationState = useNavigationState((state) => state)
  const routes = useNavigationState((state) => state.routes)

  useEffect(() => {
    const unsubscribe = AppState.addEventListener('change', (nextAppState) => {
      setAppState(nextAppState)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (Platform.OS === 'ios') {
      if (appState === 'active') {
        // This will run everytime the ios app comes back into the foreground
        PushNotificationIOS.checkPermissions((permissions) => {
          if (permissions.alert === true) {
            dispatch(
              setPushNotificationPermission(Permission.PermissionPermitted),
            )
          } else {
            if (pushNotificationPermission === Permission.PermissionPermitted) {
              // User has switched of push notification access outside of the app
              dispatch(
                setPushNotificationPermission(Permission.PermissionDenied),
              )
            }
          }
        })
      }
    } else if (Platform.OS === 'android') {
      dispatch(setPushNotificationPermission(Permission.PermissionPermitted))
    }
  }, [appState, dispatch, pushNotificationPermission])

  useEffect(() => {
    PushNotificationAndroid.configure({
      onRegister({token}: {token?: string}) {
        if (Platform.OS === 'android') {
          onRegisteredAndroid(token)
        }
      },
      requestPermissions: false,
    })

    PushNotificationIOS.addEventListener('register', onRegisteredIOS)
    return () => {
      PushNotificationIOS.removeEventListener('register', onRegisteredIOS)
    }
  })

  const onRegisteredIOS = (deviceToken?: string) => {
    dispatch(setDevicePushToken(deviceToken))
  }

  const onRegisteredAndroid = (deviceToken?: string) => {
    dispatch(setDevicePushToken(deviceToken))
  }

  const headerHeightIncludingSafeArea = useHeaderHeight()

  const loginState = loginStateSelector()
  const passportLinkedState = passportLinkedStateSelector()

  // const prevLoginState = usePrevious(loginState)
  const apiUser = patientSelector()

  useEffect(() => {
    console.log('passportLinkedState changed:', passportLinkedState)
    if (passportLinkedState === PassportLinkedState.Linked) {
      const hasModalStack = routes.length > 1
      console.log('hasModalStack:', hasModalStack)
      if (hasModalStack) {
        navigation.goBack()
      }
    }
  }, [passportLinkedState])

  useEffect(() => {
    console.log('loginState changed:', loginState)
    if (loginState === LoginState.LoggedIn) {
      const homeAtRoot =
        routes[0].state?.routes[0].name === SCREENS.HOME ?? false

      console.log('homeAtRoot:', homeAtRoot)

      if (!homeAtRoot) {
        navigation.reset({index: 1, routes: [{name: SCREENS.HOME}]})
      }
    } else if (loginState === LoginState.LoggedOut) {
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
      navigation.reset({
        index: 0,
        routes: [{name: SCREENS.SPLASH}],
      })
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
          headerTitleAlign: 'left',
          headerLeft: () => (
            <ButtonIcon
              iconName="arrow-back"
              iconColor={colors.white}
              onPress={() => {
                navigation.goBack()
              }}
            />
          ),
          title: intl.formatMessage({id: 'page-titles.consent'}),
        }}
      />
      <Stack.Screen
        name={SCREENS.LOGIN}
        component={LoginScreen}
        options={{headerShown: false}}
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
        name={SCREENS.ADD_BP}
        component={AddBpScreen}
        options={{
          headerBackTitle: ' ',
          title: intl.formatMessage({id: 'page-titles.new-bp'}),
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={SCREENS.ADD_BS}
        component={AddBsScreen}
        options={{
          headerBackTitle: ' ',
          title: intl.formatMessage({id: 'page-titles.new-bs'}),
          gestureEnabled: false,
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
        name={SCREENS.ADD_MEDICINE}
        component={AddMedicineScreen}
        options={{
          headerBackTitle: ' ',
          title: intl.formatMessage({id: 'page-titles.add-medicine'}),
        }}
      />
      <Stack.Screen
        name={SCREENS.MEDICATION_DETAILS}
        component={MedicationDetailScreen}
        options={({route}) => ({
          headerBackTitle: ' ',
          title: route.params.medication.name,
        })}
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
            if (passportLinkedState !== PassportLinkedState.Linking) {
              return (
                <ButtonIcon
                  iconName="settings"
                  onPress={() => navigation.navigate(SCREENS.SETTINGS)}
                />
              )
            }
            return null
          },
          headerLeft: () => null,
          gestureEnabled: false,
          /* cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,*/
          /*cardStyleInterpolator: forFade, */
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

function ScanStack({navigation}: Props) {
  const intl = useIntl()
  return (
    <Stack.Navigator
      initialRouteName={SCREENS.SCAN_BP_PASSPORT}
      screenOptions={{
        ...navigationStyle,
        headerTintColor: colors.white100,
        gestureEnabled: true,
      }}>
      <Stack.Screen
        name={SCREENS.SCAN_BP_PASSPORT}
        component={ScanPassportScreen}
        options={{
          title: intl.formatMessage({id: 'page-titles.scan-bp-passport'}),
          headerLeft: () => {
            return (
              <ButtonIcon
                iconName="close"
                iconColor={colors.white100}
                onPress={() => navigation.goBack()}
              />
            )
          },
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
    </Stack.Navigator>
  )
}
