import React from 'react'
import {View, StyleSheet, Image, ViewStyle} from 'react-native'
import {FormattedMessage} from 'react-intl'
import {format} from 'date-fns'

import {colors, redHeart} from '../styles'
import {Button, BodyHeader, BodyText} from './'
import {BloodPressure} from '../models'

type Props = {
  bp: BloodPressure
  style?: ViewStyle
  compact?: boolean
}

export const BpInformation = ({bp, style = {}, compact = false}: Props) => {
  const isBloodPressureHigh = (bpIn: BloodPressure) => {
    // A “High BP” is a BP whose Systolic value is greater than or equal to 140 or whose
    // Diastolic value is greater than or equal to 90. All other BPs are “Normal BP”.
    return bpIn.systolic >= 140 || bpIn.diastolic >= 90
  }

  const displayDate = (bpIn: BloodPressure) => {
    return bpIn.recorded_at
      ? format(new Date(bpIn.recorded_at), 'dd-MMM-yyy')
      : null
  }

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
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        marginTop: 24,
        ...style,
      }}>
      <Image source={redHeart} style={[styles.informationIcon]} />
      <View>
        <BodyText
          style={{
            fontSize: 18,
            color: colors.grey0,
            fontWeight: '500',
          }}>
          <>{`${bp.systolic} / ${bp.diastolic}`}</>
          {compact && (
            <>
              {`, `}
              {getBPText()}
            </>
          )}
        </BodyText>
        <BodyText
          style={{
            fontSize: 16,

            color: colors.grey1,
          }}>
          {displayDate(bp)}
        </BodyText>
      </View>
      {!compact && (
        <View
          style={{
            marginLeft: 'auto',
          }}>
          {getBPText()}
        </View>
      )}
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
