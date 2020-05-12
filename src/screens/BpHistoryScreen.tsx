import React, {useState} from 'react'
import {
  ScrollView,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {FormattedMessage} from 'react-intl'
import {useFocusEffect} from '@react-navigation/native'
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
  const bpsAll = bloodPressuresSelector() ?? []
  const [isAnimating, setIsAnimating] = useState(true)
  const bps = /*bpsAll.slice(0, 5)*/ isAnimating
    ? bpsAll.slice(0, 5)
    : [...bpsAll]
  const bpsChart = /*bpsAll.slice(0, 5)*/ isAnimating ? [] : [...bpsAll]

  useFocusEffect(
    React.useCallback(() => {
      console.log('didfocus!')
      setIsAnimating(false)
    }, []),
  )

  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={{paddingVertical: 8}}>
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
          <View style={{minHeight: 260}}>
            {isAnimating ? (
              <View
                style={[containerStyles.fill, containerStyles.centeredContent]}>
                <ActivityIndicator size="large" color={colors.blue1} />
              </View>
            ) : (
              <BpHistoryChart bps={bpsChart} />
            )}
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
            <View>
              {bps?.map((bp, index) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(SCREENS.DETAILS_MODAL_SCREEN, {
                      bp,
                    })
                  }}
                  key={index}
                  style={[
                    {
                      marginBottom: 12,
                      paddingTop: 12,
                    },
                    styles.historyItem,
                    index === bps.length - 1 ? {borderBottomWidth: 0} : {},
                  ]}>
                  <BpInformation bp={bp} />
                </TouchableOpacity>
              ))}
            </View>
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
