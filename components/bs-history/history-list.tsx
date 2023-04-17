import React from 'react'
import {
  View,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native'
import { FormattedMessage } from 'react-intl'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../../navigation/Navigation'

import { containerStyles, colors } from '../../styles'
import { BodyHeader, BsInformation, Line } from '../../components'
import SCREENS from '../../constants/screens'
import ConvertedBloodSugarReading from '../../models/converted_blood_sugar_reading'
import { BloodSugarCode } from '../../utils/blood-sugars'

type BsHistoryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.BS_HISTORY
>

type HistoryListProps = {
  navigation: BsHistoryScreenNavigationProp
  convertedReadings: ConvertedBloodSugarReading[] | null
  displayUnits: BloodSugarCode
}

const LoadingIndicator = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
      }}
    >
      <ActivityIndicator size="large" color={colors.grey2} />
    </View>
  )
}
const HistoryList = ({
  convertedReadings,
  navigation,
  displayUnits,
}: HistoryListProps) => {
  return (
    <View
      style={[
        containerStyles.containerSegment,
        { paddingVertical: 22, paddingHorizontal: 24 },
      ]}
    >
      <View style={[{ flexShrink: 0 }]}>
        <BodyHeader
          style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 14 }}
        >
          <FormattedMessage id="page-titles.all-bs" />
        </BodyHeader>
        <Line />
        {!convertedReadings && <LoadingIndicator />}
        {convertedReadings?.map((bs, index) => (
          <View key={index}>
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
                index === convertedReadings.length - 1
                  ? { borderBottomWidth: 0 }
                  : {},
              ]}
            >
              <BsInformation bs={bs} displayUnits={displayUnits} />
            </TouchableHighlight>
            {index < convertedReadings.length - 1 && (
              <Line key={'line' + index} />
            )}
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  historyItem: {
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export default HistoryList
