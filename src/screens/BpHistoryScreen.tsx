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
import Icon from 'react-native-vector-icons/MaterialIcons'

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
  const bloodPressures = bloodPressuresSelector()

  return (
    <View style={{flex: 1}}>
      <SafeAreaView
        style={[containerStyles.fill, {backgroundColor: colors.white}]}>
        <View style={{flex: 1, paddingTop: 24, paddingLeft: 24}}>
          <View style={{marginBottom: 24}}>
            <BodyHeader style={{fontSize: 22, fontWeight: 'bold'}}>
              BP History
            </BodyHeader>
          </View>
          <FlatList
            data={bloodPressures}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(SCREENS.BP_DETAILS, {bp: item})
                }}
                style={[
                  {paddingRight: 24, marginTop: 12},
                  styles.historyItem,
                  index === bloodPressures.length - 1
                    ? {borderBottomWidth: 0}
                    : {},
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <BpInformation compact bp={item} style={{marginTop: 0}} />
                  <Icon
                    name="chevron-right"
                    size={24}
                    style={{marginLeft: 'auto'}}
                    color={colors.blue2}
                  />
                </View>
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
    borderColor: colors.grey3,
    borderBottomWidth: 1,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
})
