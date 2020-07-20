import React, {useEffect, useState} from 'react'
import {View, ScrollView} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {FormattedMessage} from 'react-intl'

import {containerStyles} from '../styles'
import {BodyHeader, BsHistoryChart} from '../components'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'
import {bloodSugarsSelector} from '../redux/blood-sugar/blood-sugar.selectors'
import {bloodSugarUnitSelector} from '../redux/patient/patient.selectors'
import ConvertedBloodSugarReading from '../models/converted_blood_sugar_reading'
import HistoryList from '../components/bs-history/history-list'

import {getTestData} from '../components/bs-history/test-data'

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
  const bloodSugars = bloodSugarsSelector() ?? []

  const [convertedReadings, setConvertedReadings] = useState<
    ConvertedBloodSugarReading[] | null
  >(null)

  const displayUnits = bloodSugarUnitSelector()

  useEffect(() => {
    setConvertedReadings(
      bloodSugars.map(
        (bloodSugar) =>
          new ConvertedBloodSugarReading(bloodSugar, displayUnits),
      ),
    )
  }, [bloodSugars])

  return (
    <View style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={{paddingVertical: 18}}
        scrollIndicatorInsets={{right: 1}}>
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
            <BsHistoryChart
              bloodSugarReadings={convertedReadings ?? []}
              displayUnits={displayUnits}
            />
          </View>
        </View>
        <HistoryList
          convertedReadings={convertedReadings}
          navigation={navigation}
          displayUnits={displayUnits}
        />
      </ScrollView>
    </View>
  )
}

export default BsHistoryScreen
