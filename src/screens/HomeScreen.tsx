import React, {useContext} from 'react'
import {Dimensions} from 'react-native'
import {SafeAreaView, View, StatusBar, ScrollView} from 'react-native'
import {StackNavigationProp} from '@react-navigation/stack'

import {containerStyles, colors} from '../styles'
import {UserContext} from '../providers/user.provider'
import SCREENS from '../constants/screens'

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.HOME
>

type Props = {
  navigation: HomeScreenNavigationProp
}

function Home({navigation}: Props) {
  const {user} = useContext(UserContext)

  return (
    <SafeAreaView
      style={[containerStyles.fill, {backgroundColor: colors.white}]}>
      <StatusBar backgroundColor="blue" barStyle="light-content" />
      <View style={{position: 'absolute', marginTop: -1}}>
        <View style={{backgroundColor: colors.blue1, height: 30}} />
        <View
          style={[
            containerStyles.fill,
            {
              width: 0,
              height: 0,
              marginTop: 0,
              backgroundColor: 'transparent',
              borderStyle: 'solid',
              borderTopWidth: 50,
              borderRightWidth: Dimensions.get('window').width,
              borderBottomWidth: 0,
              borderLeftWidth: 0,
              borderTopColor: colors.blue1,
              borderRightColor: 'transparent',
              borderBottomColor: 'transparent',
              borderLeftColor: colors.blue1,
            },
          ]}
        />
      </View>
      <ScrollView
        contentContainerStyle={[
          containerStyles.fill,
          {
            backgroundColor: colors.white100,
            borderRadius: 4,
            marginHorizontal: 24,
            marginBottom: 24,
          },
        ]}
      />
    </SafeAreaView>
  )
}

export default Home
