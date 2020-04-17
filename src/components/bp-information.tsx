import React from 'react'
import {View, StyleSheet, Image} from 'react-native'
import {FormattedMessage} from 'react-intl'
import {colors, redHeart} from '../styles'

import {Button, BodyHeader, BodyText} from './'
import {BloodPressure} from '../models'

type Props = {
  bp: BloodPressure
}

export const BpInformation = ({bp}: Props) => {
  const isBloodPressureHigh = (bpIn: BloodPressure) => {
    // A “High BP” is a BP whose Systolic value is greater than or equal to 140 or whose
    // Diastolic value is greater than or equal to 90. All other BPs are “Normal BP”.
    return bpIn.systolic >= 140 || bpIn.diastolic >= 90
  }

  const displayDate = (bpIn: BloodPressure) => {
    return bpIn.recorded_at ? new Date(bpIn.recorded_at).toDateString() : null
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
      }}>
      <Image source={redHeart} style={[styles.informationIcon]} />
      <View>
        <BodyText
          style={{
            fontSize: 18,
            color: colors.grey0,
            fontWeight: '500',
          }}>{`${bp.systolic}/${bp.diastolic}`}</BodyText>
        <BodyText
          style={{
            fontSize: 16,

            color: colors.grey1,
          }}>
          {displayDate(bp)}
        </BodyText>
      </View>
      {isBloodPressureHigh(bp) ? (
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
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  bpText: {
    fontWeight: '500',
    fontSize: 18,
    marginLeft: 'auto',
  },
  informationIcon: {
    marginRight: 16,
    flexShrink: 0,
  },
})
