import React, {useContext} from 'react'
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'

import {containerStyles, colors} from '../styles'
import {BodyHeader, BpInformation} from '../components'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'
import {bloodPressuresSelector} from '../redux/blood-pressure/blood-pressure.selectors'

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
  const bps = bloodPressuresSelector()

  return (
    <View style={{flex: 1}}>
      <SafeAreaView
        style={[containerStyles.fill, {backgroundColor: colors.white}]}>
        <View style={{flex: 1, paddingTop: 24, paddingLeft: 24}}>
          <View style={{marginBottom: 16}}>
            <BodyHeader style={{fontSize: 22, fontWeight: 'bold'}}>
              BP History
            </BodyHeader>
          </View>
          <FlatList
            data={bps}
            renderItem={({item: bp, index}) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(SCREENS.DETAILS_MODAL_SCREEN, {
                    bp,
                  })
                }}
                key={index}
                style={[
                  {
                    marginRight: 24,
                    marginBottom: 12,
                    paddingTop: 12,
                  },
                  styles.historyItem,
                  index === bps.length - 1 ? {borderBottomWidth: 0} : {},
                ]}>
                <BpInformation bp={bp} />
              </TouchableOpacity>
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

const styles = StyleSheet.create({
  historyItem: {
    borderTopWidth: 1,
    borderColor: colors.grey3,
    flexDirection: 'row',
    alignItems: 'center',
  },
})
