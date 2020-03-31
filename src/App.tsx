import React from 'react'
import {View, Image} from 'react-native'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

import {useDarkMode} from 'react-native-dark-mode'

import {iconSplash, containerStyles, colors} from './styles'

const Stack = createStackNavigator()

export default function App() {
  return <Navigation />
}

function SplashScreen() {
  return (
    <View
      style={[
        containerStyles.fill,
        containerStyles.centeredContent,
        {backgroundColor: colors.Black},
      ]}>
      <Image source={iconSplash} />
      <View />
    </View>
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
        initialRouteName="SplashScreen"
        headerMode={'none'}
        screenOptions={{
          gestureEnabled: true,
        }}>
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{title: 'BP Passport'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
