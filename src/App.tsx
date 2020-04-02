import React, {useEffect} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {useDarkMode} from 'react-native-dark-mode'
import {IntlProvider} from 'react-intl'
import useLocaleMessages from './effects/use-locale-messages.effect'

import {colors} from './styles'

import SCREENS from './constants/screens'
import LaunchScreen from './screens/LaunchScreen'
import SplashScreen from './screens/SplashScreen'

import {forFade} from './navigation/interpolators'

const Stack = createStackNavigator()

export default function App() {
  const localeMessages = useLocaleMessages()

  useEffect(() => {
    console.log(
      'localeMessages changed >> ',
      localeMessages.locale,
      localeMessages.messages,
    )
  }, [localeMessages])

  return (
    <IntlProvider
      locale={localeMessages.locale}
      messages={localeMessages.messages}>
      <Navigation />
    </IntlProvider>
  )
}

function Navigation() {
  const ref = React.useRef()

  const isDarkMode = useDarkMode()

  const theme = {
    dark: false,
    colors: {
      primary: 'rgb(255, 45, 85)',
      background: colors.Black,
      card: 'rgb(255, 255, 255)',
      text: 'rgb(28, 28, 30)',
      border: 'rgb(199, 199, 204)',
    },
  }

  return (
    <NavigationContainer ref={ref} theme={isDarkMode ? theme : theme}>
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
    </NavigationContainer>
  )
}

function MainStack() {
  return (
    <Stack.Navigator
      initialRouteName={SCREENS.SPLASH}
      headerMode={'none'}
      screenOptions={{
        gestureEnabled: true,
      }}>
      <Stack.Screen name={SCREENS.SPLASH} component={SplashScreen} />
    </Stack.Navigator>
  )
}
