import React from 'react'
import { View, StyleSheet, Image, ViewStyle } from 'react-native'
import { format } from 'date-fns'
import { MaterialIcons } from '@expo/vector-icons'
import { useIntl } from 'react-intl'

import { colors, medicinePill } from '../styles'
import { BodyText } from './text'
import {
  Medication,
  frequencyText,
  dateForDayOffset,
} from '../redux/medication/medication.models'
import { dateLocale } from '../constants/languages'

type Props = {
  meds: Medication
  style?: ViewStyle
}

export const MedsInformation = ({ meds }: Props) => {
  let reminderText: string | undefined

  const intl = useIntl()

  const reminder = meds.reminder
  if (reminder) {
    const translationKey = frequencyText(reminder.days)

    reminderText = intl.formatMessage({ id: translationKey })

    const date = dateForDayOffset(reminder.dayOffset)
    reminderText +=
      ', ' +
      format(date, 'h:mm a', {
        locale: dateLocale(),
      })
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          marginRight: 5,
          alignItems: 'center',
        }}
      >
        <Image source={medicinePill} style={[styles.informationIcon]} />
        <View
          style={{
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <BodyText
            style={{
              fontSize: 18,
              color: colors.grey0,
            }}
          >
            <>
              {meds.name} {meds.dosage && meds.dosage}
            </>
          </BodyText>
          {reminderText && (
            <BodyText
              style={{
                fontSize: 16,
                color: colors.grey1,
              }}
            >
              {reminderText}
            </BodyText>
          )}
        </View>
      </View>
      <MaterialIcons
        name="chevron-right"
        size={24}
        style={{ marginLeft: 'auto' }}
        color={colors.grey3}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  bpText: {
    fontWeight: '500',
    fontSize: 18,
    marginLeft: 'auto',
    textAlign: 'center',
  },
  informationIcon: {
    marginRight: 16,
  },
})
