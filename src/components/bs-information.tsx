import React from 'react'
import {View, StyleSheet, Image, ViewStyle} from 'react-native'
import {FormattedMessage} from 'react-intl'
import Icon from 'react-native-vector-icons/MaterialIcons'

import {colors, purpleDrop, smallWarningSign} from '../styles'
import {BodyText} from './'
import {BLOOD_SUGAR_TYPES} from '../redux/blood-sugar/blood-sugar.models'
import {
  displayDate,
  isHighBloodSugar,
  isLowBloodSugar,
  showWarning,
  getDisplayBloodSugarUnit,
  BloodSugarCode,
  getReadingType,
} from '../utils/blood-sugars'

import ConvertedBloodSugarReading from '../models/converted_blood_sugar_reading'

type Props = {
  bs: ConvertedBloodSugarReading
  displayUnits: BloodSugarCode
  style?: ViewStyle
}

export const BsInformation = ({bs, displayUnits, style = {}}: Props) => {
  const getBSText = () => {
    if (isHighBloodSugar(bs)) {
      return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <BodyText
            style={[
              styles.bsText,
              {
                color: colors.red1,
              },
            ]}>
            <FormattedMessage id="general.high" />
          </BodyText>
          {showWarning(bs) && (
            <Image source={smallWarningSign} style={styles.warningIcon} />
          )}
        </View>
      )
    }

    return isLowBloodSugar(bs) ? (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <BodyText
          style={[
            styles.bsText,
            {
              color: colors.red1,
            },
          ]}>
          <FormattedMessage id="general.low" />
        </BodyText>
        <Image source={smallWarningSign} style={styles.warningIcon} />
      </View>
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

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
      }}>
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          ...style,
        }}>
        <Image source={purpleDrop} style={[styles.informationIcon]} />
        <View style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            <BodyText
              style={{
                fontSize: 18,
                color: colors.grey0,
              }}>
              {`${bs.value}`}
              {bs.blood_sugar_type === BLOOD_SUGAR_TYPES.HEMOGLOBIC
                ? '%'
                : ' ' + getDisplayBloodSugarUnit(displayUnits)}{' '}
            </BodyText>
            <View>{getBSText()}</View>
          </View>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            <BodyText
              style={{
                fontSize: 16,
                lineHeight: 20,
                color: colors.grey1,
                fontWeight: 'bold',
              }}>
              {`${getReadingType(bs)}, `}
            </BodyText>
            <BodyText
              style={{
                fontSize: 16,
                lineHeight: 20,
                color: colors.grey1,
              }}>
              {displayDate(bs)}
            </BodyText>
          </View>
        </View>
      </View>
      <Icon name="chevron-right" size={24} color={colors.grey3} />
    </View>
  )
}

const styles = StyleSheet.create({
  bsText: {
    fontWeight: '500',
    fontSize: 18,
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
