import React from 'react'
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native'
import {BLOOD_SUGAR_TYPES} from '../../redux/blood-sugar/blood-sugar.models'
import {FormattedMessage} from 'react-intl'
import {colors} from '../../styles'
import {BodyText} from '../text'

export class ChartTypeSelectionPillProps {
  changeChartType: (newChartType: BLOOD_SUGAR_TYPES) => void
  currentChartType: BLOOD_SUGAR_TYPES
  newChartType: BLOOD_SUGAR_TYPES
  pillLabel: string
}

export const ChartTypeSelectionPill = ({
  changeChartType,
  currentChartType,
  newChartType,
  pillLabel,
}: ChartTypeSelectionPillProps) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        changeChartType(newChartType)
      }}>
      <View
        style={[
          styles.pill,
          currentChartType === newChartType ? styles.pillActive : {},
        ]}>
        <BodyText
          style={{
            color:
              currentChartType === newChartType
                ? colors.white100
                : colors.blue2,
          }}>
          {pillLabel}
        </BodyText>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.blue3,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12,
    marginRight: 12,
  },
  pillActive: {
    backgroundColor: colors.blue2,
  },
})
