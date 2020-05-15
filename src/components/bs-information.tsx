import React from 'react'
import {View, StyleSheet, Image, ViewStyle} from 'react-native'
import {FormattedMessage, useIntl} from 'react-intl'
import Icon from 'react-native-vector-icons/MaterialIcons'

import {colors, purpleDrop} from '../styles'
import {BodyText} from './'
import {
  BloodSugar,
  BLOOD_SUGAR_TYPES,
} from '../redux/blood-sugar/blood-sugar.models'
import {
  displayDate,
  isHighBloodSugar,
  getBloodSugarDetails,
} from '../utils/blood-sugars'

type Props = {
  bs: BloodSugar
  style?: ViewStyle
}

export const BsInformation = ({bs, style = {}}: Props) => {
  const intl = useIntl()

  const getBSText = () => {
    return isHighBloodSugar(bs) ? (
      <BodyText
        style={[
          styles.bsText,
          {
            color: colors.red1,
          },
        ]}>
        <FormattedMessage id="general.high" />
      </BodyText>
    ) : (
      <BodyText
        style={[
          styles.bsText,
          {
            color: colors.green1,
          },
        ]}>
        <FormattedMessage id="general.normal" />
      </BodyText>
    )
  }

  const details = getBloodSugarDetails(bs)

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
        <Image source={purpleDrop} style={[styles.informationIcon]} />
        <View>
          <View style={{flexDirection: 'row'}}>
            <BodyText
              style={{
                fontSize: 18,
                color: colors.grey0,
                fontWeight: '500',
              }}>
              {`${bs.blood_sugar_value}`}
              {bs.blood_sugar_type === BLOOD_SUGAR_TYPES.HEMOGLOBIC ? (
                <>
                  <BodyText>%</BodyText>{' '}
                  <FormattedMessage id={details.languageTypeCode} />
                </>
              ) : (
                <>
                  {' '}
                  <FormattedMessage id="bs.mgdl" />{' '}
                  <FormattedMessage id={details.languageTypeCode} />
                </>
              )}
            </BodyText>
            <BodyText
              style={{
                fontSize: 18,
                color: colors.grey0,
                fontWeight: '500',
                marginLeft: 8,
              }}>
              {getBSText()}
            </BodyText>
          </View>
          <BodyText
            style={{
              fontSize: 16,

              color: colors.grey1,
            }}>
            {displayDate(bs)}
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
