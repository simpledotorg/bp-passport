import React from 'react'
import {View, StyleSheet, Image, ViewStyle} from 'react-native'
import {FormattedMessage, useIntl} from 'react-intl'
import {format} from 'date-fns'

import {colors, purpleDrop} from '../styles'
import {BodyText} from './'
import {
  BloodSugar,
  BLOOD_SUGAR_TYPES,
} from '../redux/blood-sugar/blood-sugar.models'
import {SUGAR_TYPE_VALUES} from '../constants/blood-sugars'

type Props = {
  bs: BloodSugar
  style?: ViewStyle
  compact?: boolean
}

export const BsInformation = ({bs, style = {}, compact = false}: Props) => {
  const intl = useIntl()

  const displayDate = (bsIn: BloodSugar) => {
    return bsIn.recorded_at
      ? format(new Date(bsIn.recorded_at), 'dd-MMM-yyy')
      : null
  }

  const isHighBloodSugar = () => {
    return (
      bs.blood_sugar_value >=
      (
        SUGAR_TYPE_VALUES[bs.blood_sugar_type] ??
        SUGAR_TYPE_VALUES[BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR]
      )?.high
    )
  }

  const getBSText = () => {
    return isHighBloodSugar() ? (
      <BodyText
        style={[
          styles.bsText,
          {
            color: colors.red1,
          },
        ]}>
        <FormattedMessage id="bs.high-rbs" />
      </BodyText>
    ) : (
      <BodyText
        style={[
          styles.bsText,
          {
            color: colors.green1,
          },
        ]}>
        <FormattedMessage id="bs.normal-rbs" />
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
      <Image source={purpleDrop} style={[styles.informationIcon]} />
      <View>
        <BodyText
          style={{
            fontSize: 18,
            color: colors.grey0,
            fontWeight: '500',
          }}>
          {`${bs.blood_sugar_value} ${intl.formatMessage({id: 'bs.mgdl'})}`}
          {compact && (
            <>
              {`, `}
              {getBSText()}
            </>
          )}
        </BodyText>
        <BodyText
          style={{
            fontSize: 16,

            color: colors.grey1,
          }}>
          {displayDate(bs)}
        </BodyText>
      </View>
      {!compact && (
        <View
          style={{
            marginLeft: 'auto',
          }}>
          {getBSText()}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  bsText: {
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
