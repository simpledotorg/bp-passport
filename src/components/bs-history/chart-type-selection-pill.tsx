import React from 'react'
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {BLOOD_SUGAR_TYPES} from '../../redux/blood-sugar/blood-sugar.models'
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
  const active = currentChartType === newChartType
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        changeChartType(newChartType)
      }}>
      <View style={[styles.pill, active ? styles.pillActive : {}]}>
        {active && (
          <Icon
            name="done"
            size={18}
            style={{alignSelf: 'center', paddingRight: 6.4}}
            color={colors.white}
          />
        )}
        <BodyText
          style={{
            color: active ? colors.white100 : colors.blue2,
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
    flexDirection: 'row',
  },
  pillActive: {
    backgroundColor: colors.blue2,
  },
})
