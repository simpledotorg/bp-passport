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
import {BodyHeader, BsInformation} from '../components'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'
import {bloodSugarsSelector} from '../redux/blood-sugar/blood-sugar.selectors'

type BsHistoryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.BS_HISTORY
>

type BsHistoryScreenRouteProp = RouteProp<
  RootStackParamList,
  SCREENS.BS_HISTORY
>

type Props = {
  navigation: BsHistoryScreenNavigationProp
  route: BsHistoryScreenRouteProp
}

function BsHistoryScreen({navigation, route}: Props) {
  const bloodSugars = bloodSugarsSelector()

  return (
    <View style={{flex: 1}}>
      <SafeAreaView
        style={[containerStyles.fill, {backgroundColor: colors.white}]}>
        <View style={{flex: 1, paddingTop: 24, paddingLeft: 24}}>
          <View style={{marginBottom: 24}}>
            <BodyHeader style={{fontSize: 22, fontWeight: 'bold'}}>
              BS History
            </BodyHeader>
          </View>
          <FlatList
            data={bloodSugars}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(SCREENS.BS_DETAILS, {bs: item})
                }}
                style={[
                  {paddingRight: 24},
                  styles.historyItem,
                  index === (bloodSugars ?? []).length - 1
                    ? {borderBottomWidth: 0}
                    : {},
                ]}>
                <BsInformation
                  compact
                  bs={item}
                  style={index === 0 ? {marginTop: 0} : {marginTop: 12}}
                />
                <Icon
                  name="chevron-right"
                  size={24}
                  style={{marginLeft: 'auto'}}
                  color={colors.blue2}
                />
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

export default BsHistoryScreen

const styles = StyleSheet.create({
  historyItem: {
    borderColor: colors.grey3,
    borderBottomWidth: 1,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
})
