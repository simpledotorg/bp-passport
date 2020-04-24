import React from 'react'
import {View, StyleSheet, Image, ViewStyle} from 'react-native'
import {FormattedMessage, useIntl} from 'react-intl'

import {colors, purpleDrop} from '../styles'
import {BodyText} from './'
import {BloodSugar} from '../redux/blood-sugar/blood-sugar.models'
import {
  displayDate,
  isHighBloodSugar,
  getBloodSugarDetails,
} from '../utils/blood-sugars'

type Props = {
  bs: BloodSugar
  style?: ViewStyle
  compact?: boolean
}

export const BsInformation = ({bs, style = {}, compact = false}: Props) => {
  const intl = useIntl()

  const getBSText = () => {
    const details = getBloodSugarDetails(bs)
    return isHighBloodSugar(bs) ? (
      <BodyText
        style={[
          styles.bsText,
          {
            color: colors.red1,
          },
        ]}>
        {`${intl.formatMessage({id: 'bs.high'})} ${intl.formatMessage({
          id: details.languageTypeCode,
        })}`}
      </BodyText>
    ) : (
      <BodyText
        style={[
          styles.bsText,
          {
            color: colors.green1,
          },
        ]}>
        {`${intl.formatMessage({id: 'bs.normal'})} ${intl.formatMessage({
          id: details.languageTypeCode,
        })}`}
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
