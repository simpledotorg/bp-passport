import React from 'react'
import {
  ScrollView,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {FormattedMessage} from 'react-intl'
import {VictoryChart, VictoryTheme, VictoryLine} from 'victory-native'

import {containerStyles, colors} from '../styles'
import {BodyHeader, BpInformation, BpHistoryChart} from '../components'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'
import {bloodPressuresSelector} from '../redux/blood-pressure/blood-pressure.selectors'
import {BloodPressure} from '../redux/blood-pressure/blood-pressure.models'

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
    <View style={{flex: 1, padding: 18}}>
      {/* 
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
                <FormattedMessage id="all-bp.bp-trend" />
              </BodyHeader>
            </View>
          </View>
          <View>
            <BpHistoryChart bps={bps ?? []} />
          </View>
        </View>*/}

      <FlatList
        data={bps}
        ListHeaderComponent={
          <View
            style={[containerStyles.containerSegment, {paddingHorizontal: 0}]}>
            <BodyHeader
              style={{
                marginHorizontal: 8,
                fontSize: 22,
                fontWeight: 'bold',
                marginBottom: 14,
              }}>
              <FormattedMessage id="all-bp.bp-trend" />
            </BodyHeader>

            <BpHistoryChart bps={bps ?? []} />
          </View>
        }
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
