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
import {LineChart} from 'react-native-chart-kit'
import {FormattedMessage} from 'react-intl'
import {format} from 'date-fns'

import {containerStyles, colors} from '../styles'
import {BodyHeader, BpInformation} from '../components'
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

  const isBloodPressureHigh = (bpIn: BloodPressure) => {
    // A “High BP” is a BP whose Systolic value is greater than or equal to 140 or whose
    // Diastolic value is greater than or equal to 90. All other BPs are “Normal BP”.
    return bpIn.systolic >= 140 || bpIn.diastolic >= 90
  }

  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={{paddingVertical: 8}}>
        <View
          style={[
            containerStyles.containerSegment,
            {paddingVertical: 22, paddingHorizontal: 24},
          ]}>
          <View style={[{flexShrink: 0}]}>
            <View
              style={{
                borderBottomWidth: 1,
                borderColor: colors.grey3,
              }}>
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
          <View style={{overflow: 'hidden'}}>
            <LineChart
              data={{
                labels: (bps ?? []).map(
                  (bp) => `${bp.systolic}/${bp.diastolic}`,
                ),
                datasets: [
                  {
                    data: (bps ?? []).map((bp) => bp.diastolic),
                    color: (opacity = 1) => `rgba(108,115,122, ${opacity})`,
                  },
                  {
                    data: (bps ?? []).map((bp) => bp.systolic),
                    color: (opacity = 1) => `rgba(108,115,122, ${opacity})`,
                  },
                ],
              }}
              width={Dimensions.get('window').width - 48} // from react-native
              height={220}
              chartConfig={{
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                color: (opacity = 1) => `rgba(47,54,61, ${opacity})`,
              }}
              withShadow={false}
              withHorizontalLabels={false}
              style={{
                marginTop: 16,
                position: 'relative',
                left: -24,
              }}
              getDotColor={(item, index) => {
                return '#fff'
              }}
              getDotProps={(datapoint, index) => {
                return {
                  r: '4',
                  strokeWidth: '2',
                  stroke: isBloodPressureHigh((bps ?? [])[index])
                    ? colors.red1
                    : colors.green1,
                }
              }}
            />
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
              <FormattedMessage id="page-titles.all-bp" />
            </BodyHeader>
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
        </View>
      </ScrollView>
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
