import React from 'react'
import {View, StyleSheet, Image} from 'react-native'
import {useIntl, FormattedMessage} from 'react-intl'

import {colors, redHeart} from '../styles'

import {Button, BodyHeader, BodyText} from './'

export const BpInformation = ({bp}: any) => {
  const intl = useIntl()

  const isBloodPressureHigh = (bp: any) => {
    // A “High BP” is a BP whose Systolic value is greater than or equal to 140 or whose
    // Diastolic value is greater than or equal to 90. All other BPs are “Normal BP”.
    return bp.systolic >= 140 || bp.diastolic >= 90
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
          {bp.date}
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
