import React from 'react'
import {View, StyleSheet, Image, ViewStyle} from 'react-native'
import {FormattedMessage} from 'react-intl'
import {format} from 'date-fns'
import Icon from 'react-native-vector-icons/MaterialIcons'

import {colors, redHeart, smallWarningSign} from '../styles'
import {BodyText} from './'
import {BloodPressure} from '../redux/blood-pressure/blood-pressure.models'
import {dateLocale} from '../constants/languages'

type Props = {
  bp: BloodPressure
  style?: ViewStyle
}

export const BpInformation = ({bp, style = {}}: Props) => {
  const showWarning = (bpIn: BloodPressure) => {
    // This is a high blood pressure that is high enough to warrant a warning
    return bpIn.systolic >= 180 || bpIn.diastolic >= 110
  }

  const isBloodPressureHigh = (bpIn: BloodPressure) => {
    // A “High BP” is a BP whose Systolic value is greater than or equal to 140 or whose
    // Diastolic value is greater than or equal to 90. All other BPs are “Normal BP”.
    return bpIn.systolic >= 140 || bpIn.diastolic >= 90
  }

  const displayDate = (bpIn: BloodPressure) => {
    return bpIn.recorded_at
      ? format(new Date(bpIn.recorded_at), `dd-MMM-yyy',' h:mm a`, {
          locale: dateLocale(),
        })
      : null
  }

  const getBPText = () => {
    return isBloodPressureHigh(bp) ? (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <BodyText
          style={[
            styles.bpText,
            {
              color: colors.red1,
            },
          ]}>
          <FormattedMessage id="general.high" />
        </BodyText>
        {showWarning(bp) && (
          <Image source={smallWarningSign} style={styles.warningIcon} />
        )}
      </View>
    ) : (
      <BodyText
        style={[
          styles.bpText,
          {
            color: colors.green1,
          },
        ]}>
        <FormattedMessage id="general.normal" />
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
        overflow: 'hidden',
      }}>
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          ...style,
        }}>
        <Image source={redHeart} style={[styles.informationIcon]} />
        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', flex: 1}}>
            <BodyText
              style={{
                fontSize: 18,
                color: colors.grey0,
              }}>
              {`${bp.systolic} / ${bp.diastolic}`}
            </BodyText>
            <View
              style={{
                marginLeft: 8,
              }}>
              {getBPText()}
            </View>
          </View>
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
  warningIcon: {
    marginLeft: 4,
    marginTop: 3,
  },
})
