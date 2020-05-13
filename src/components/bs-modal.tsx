import React from 'react'
import {
  View,
  StyleSheet,
  Image,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native'
import {FormattedMessage, useIntl} from 'react-intl'

import {colors, purpleDrop} from '../styles'
import {BodyHeader, BodyText, Button} from './'
import {BloodSugar} from '../redux/blood-sugar/blood-sugar.models'
import {
  displayDate,
  isHighBloodSugar,
  getBloodSugarDetails,
} from '../utils/blood-sugars'
import {useThunkDispatch} from '../redux/store'
import {deleteBloodSugar} from '../redux/blood-sugar/blood-sugar.actions'

type Props = {
  bs: BloodSugar
  close: () => void
}

export const BsModal = ({bs, close}: Props) => {
  const intl = useIntl()
  const dispatch = useThunkDispatch()

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
    <TouchableWithoutFeedback
      onPress={(e) => {
        e.stopPropagation()
        e.preventDefault()
      }}>
      <View
        style={{
          padding: 24,
          backgroundColor: colors.white100,
        }}>
        <BodyHeader
          style={{
            fontWeight: 'bold',
            fontSize: 22,
            marginBottom: 16,
          }}>
          <FormattedMessage id="bs.bs-details" />
        </BodyHeader>
        <View style={{flexDirection: 'row'}}>
          <Image source={purpleDrop} />
          <View style={{paddingLeft: 16}}>
            <BodyText
              style={{
                lineHeight: 26,
                paddingTop: 12,
                fontSize: 18,
                color: colors.grey0,
              }}>
              {`${bs.blood_sugar_value} ${intl.formatMessage({id: 'bs.mgdl'})}`}

              <>
                {` `}
                {getBSText()}
              </>
            </BodyText>

            <BodyText
              style={{
                lineHeight: 26,
                paddingTop: 12,
                fontSize: 16,
                color: colors.grey1,
              }}>
              {displayDate(bs)}
            </BodyText>

            {bs.facility && (
              <BodyText style={{lineHeight: 26, paddingTop: 12}}>
                <FormattedMessage
                  id="general.recorded_at"
                  values={{
                    location: bs.facility?.name,
                  }}
                />
              </BodyText>
            )}
          </View>
        </View>
        <View style={{marginTop: 24, flexDirection: 'row'}}>
          <Button
            style={[
              {
                backgroundColor: colors.blue3,
                shadowColor: 'rgba(0, 117, 235, 0.3)',
                flex: 1,
              },
            ]}
            buttonColor={colors.blue2}
            title={intl.formatMessage({id: 'general.close'})}
            onPress={() => {
              close()
            }}
          />
          {bs.offline && (
            <Button
              style={{
                backgroundColor: colors.white100,
                flex: 1,
              }}
              buttonColor={colors.red1}
              disableBoxShadow
              title={intl.formatMessage({id: 'general.delete'})}
              onPress={() => {
                Alert.alert(
                  intl.formatMessage({id: 'bs.delete-bs'}),
                  intl.formatMessage({id: 'bs.delete-bs-confirm'}),
                  [
                    {
                      text: intl.formatMessage({id: 'general.cancel'}),
                    },
                    {
                      text: intl.formatMessage({id: 'general.ok'}),
                      onPress: () => {
                        dispatch(deleteBloodSugar(bs))
                        close()
                      },
                    },
                  ],
                  {cancelable: true},
                )
              }}
            />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
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
