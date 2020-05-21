import React from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {FormattedMessage} from 'react-intl'

import {containerStyles, colors} from '../styles'
import {BodyHeader, BsInformation, BsHistoryChart, Line} from '../components'
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
      <ScrollView contentContainerStyle={{paddingVertical: 18}}>
        <View
          style={[
            containerStyles.containerSegment,
            {paddingVertical: 22, paddingHorizontal: 24},
          ]}>
          <View style={[{flexShrink: 0}]}>
            <View>
              <BodyHeader
                style={{
                  fontSize: 22,
                  fontWeight: 'bold',
                  marginBottom: 14,
                }}>
                <FormattedMessage id="bs.bs-trend" />
              </BodyHeader>
            </View>
          </View>
          <View style={{minHeight: 304}}>
            <BsHistoryChart bss={bloodSugars ?? []} />
          </View>
        </View>
        <View
          style={[
            containerStyles.containerSegment,
            {paddingVertical: 22, paddingHorizontal: 24},
          ]}>
          <View style={[{flexShrink: 0}]}>
            <BodyHeader
              style={{fontSize: 22, fontWeight: 'bold', marginBottom: 14}}>
              <FormattedMessage id="page-titles.all-bs" />
            </BodyHeader>
            <Line />
            <View>
              {bloodSugars?.map((bs, index) => (
                <>
                  <TouchableHighlight
                    underlayColor={colors.grey4}
                    activeOpacity={0.8}
                    onPress={() => {
                      navigation.navigate(SCREENS.DETAILS_MODAL_SCREEN, {
                        bs,
                      })
                    }}
                    key={index}
                    style={[
                      {
                        paddingVertical: 12,
                        marginHorizontal: -24,
                        paddingHorizontal: 24,
                      },
                      styles.historyItem,
                      index === bloodSugars.length - 1
                        ? {borderBottomWidth: 0}
                        : {},
                    ]}>
                    <BsInformation bs={bs} />
                  </TouchableHighlight>
                  {index < bloodSugars.length - 1 && (
                    <Line key={'line' + index} />
                  )}
                </>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default BsHistoryScreen

const styles = StyleSheet.create({
  historyItem: {
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
})
