import React from 'react'
import {SafeAreaView, View, FlatList} from 'react-native'
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
  const {bps}: {bps: any[]} = route.params

  return (
    <View style={{flex: 1}}>
      <SafeAreaView
        style={[containerStyles.fill, {backgroundColor: colors.white}]}>
        <View style={{flex: 1, paddingVertical: 24, paddingLeft: 24}}>
          <View style={{marginBottom: 24}}>
            <BodyHeader style={{fontSize: 22, fontWeight: 'bold'}}>
              BP History
            </BodyHeader>
          </View>
          <FlatList
            data={bps}
            renderItem={({item, index}) => (
              <View style={{marginRight: 24}}>
                <BpInformation
                  bp={item}
                  style={index === 0 ? {marginTop: 0} : null}
                />
              </View>
            )}
            keyExtractor={(item, index) => {
              return `key-${index}`
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  )
}

export default BpHistoryScreen
