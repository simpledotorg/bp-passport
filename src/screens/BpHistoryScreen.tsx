import React from 'react'
import {SafeAreaView, View, TextInput} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'

import {containerStyles, colors} from '../styles'
import {BodyHeader, BpInformation} from '../components'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'

type BpHistoryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.BP_HISTORY
>

type BpHistoryScreenRouteProp = RouteProp<
  RootStackParamList,
  SCREENS.BP_HISTORY
>

type Props = {
  navigation: BpHistoryScreenNavigationProp
  route: BpHistoryScreenRouteProp
}

function BpHistoryScreen({navigation, route}: Props) {
  const {bps} = route.params

  return (
    <View style={{flex: 1}}>
      <SafeAreaView
        style={[containerStyles.fill, {backgroundColor: colors.white}]}>
        <View style={{margin: 24}}>
          <BodyHeader style={{fontSize: 22, fontWeight: 'bold'}}>
            BP History
          </BodyHeader>
          {bps.map((bp, index) => {
            return <BpInformation bp={bp} key={index} />
          })}
        </View>
      </SafeAreaView>
    </View>
  )
}

export default BpHistoryScreen
