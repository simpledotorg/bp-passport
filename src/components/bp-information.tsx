import React from 'react'
import {View, StyleSheet, Image, ViewStyle} from 'react-native'
import {FormattedMessage} from 'react-intl'
import {format} from 'date-fns'
import Icon from 'react-native-vector-icons/MaterialIcons'

import {colors, redHeart} from '../styles'
import {BodyText} from './'
import {BloodPressure} from '../redux/blood-pressure/blood-pressure.models'

type Props = {
  bp: BloodPressure
  style?: ViewStyle
}

export const BpInformation = ({bp, style = {}}: Props) => {
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
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          ...style,
        }}>
        <Image source={redHeart} style={[styles.informationIcon]} />
        <View>
          <BodyText
            style={{
              fontSize: 18,
              color: colors.grey0,
            }}>
            <>{`${bp.systolic} / ${bp.diastolic}`}</>

            <>
              {` `}
              {getBPText()}
            </>
          </BodyText>
          <BodyText
            style={{
              fontSize: 16,
              color: colors.grey1,
            }}>
            {displayDate(bp)}
          </BodyText>
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
