import React, {useContext} from 'react'
import {SafeAreaView, View, StatusBar, Linking} from 'react-native'
import {FormattedMessage} from 'react-intl'
import {containerStyles, colors} from '../styles'
import {UserContext} from '../providers/user.provider'

function Home({navigation}: any) {
  const {user} = useContext(UserContext)

  return (
    <SafeAreaView
      style={[containerStyles.fill, {backgroundColor: colors.white}]}>
      <StatusBar backgroundColor="blue" barStyle="light-content" />
      <View
        style={[
          containerStyles.fill,
          containerStyles.centeredContent,
          {margin: 24},
        ]}></View>
      <View />
    </SafeAreaView>
  )
}

export default Home
