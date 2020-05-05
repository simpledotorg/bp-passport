import React from 'react'
import {View, StyleSheet, Image, ViewStyle} from 'react-native'
import {FormattedMessage} from 'react-intl'
import {format} from 'date-fns'
import Icon from 'react-native-vector-icons/MaterialIcons'

import {colors, medicinePill} from '../styles'
import {BodyText} from './'
import {Medication} from '../redux/medication/medication.models'

type Props = {
  meds: Medication
  style?: ViewStyle
}

export const MedsInformation = ({meds, style = {}}: Props) => {
  /*
  const getBPText = () => {
    return isBloodPressureHigh(bp) ? (
      <BodyText
        style={[
          styles.bpText,
          {
            color: colors.red1,
          },
        ]}>
        <FormattedMessage id="general.high-bp" />
      </BodyText>
    ) : (
      <BodyText
        style={[
          styles.bpText,
          {
            color: colors.green1,
          },
        ]}>
        <FormattedMessage id="general.normal-bp" />
      </BodyText>
    )
  } */

  let reminderText: string | undefined = undefined

  return (
    <View
      style={{
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          ...style,
        }}>
        <Image source={medicinePill} style={[styles.informationIcon]} />
        <View style={{justifyContent: 'center'}}>
          <BodyText
            style={{
              fontSize: 18,
              color: colors.grey0,
            }}>
            <>
              {meds.name} {meds.dosage && meds.dosage}
            </>
          </BodyText>
          {reminderText && (
            <BodyText
              style={{
                fontSize: 16,
                color: colors.grey1,
              }}>
              {reminderText}
            </BodyText>
          )}
        </View>
      </View>
      <Icon
        name="chevron-right"
        size={24}
        style={{marginLeft: 'auto'}}
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
    flexShrink: 0,
  },
})
