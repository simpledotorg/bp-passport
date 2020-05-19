import React from 'react'
import {
  View,
  StyleSheet,
  Image,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native'
import {FormattedMessage, useIntl} from 'react-intl'
import {format} from 'date-fns'

import {colors, purpleDrop} from '../styles'
import {BodyHeader, BodyText, Button} from './'
import {
  BloodSugar,
  BLOOD_SUGAR_TYPES,
} from '../redux/blood-sugar/blood-sugar.models'
import {
  displayDate,
  isHighBloodSugar,
  getBloodSugarDetails,
} from '../utils/blood-sugars'
import {useThunkDispatch} from '../redux/store'
import {deleteBloodSugar} from '../redux/blood-sugar/blood-sugar.actions'
import {ButtonType} from './button'

type Props = {
  bs: BloodSugar
  close: () => void
}

export const BsModal = ({bs, close}: Props) => {
  const intl = useIntl()
  const dispatch = useThunkDispatch()

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

  const getNotes = () => {
    const bsDetails = getBloodSugarDetails(bs)
    return isHighBloodSugar(bs) ? (
      <BodyText>
        <FormattedMessage
          id="general.sheet-high-disclaimer"
          values={{
            label: <FormattedMessage id={bsDetails.languageTypeCode} />,
            limit: (
              <BodyText>
                {bs.blood_sugar_type === BLOOD_SUGAR_TYPES.HEMOGLOBIC ? (
                  <>
                    {bsDetails.high}
                    <BodyText>%</BodyText>
                  </>
                ) : (
                  <>
                    {bsDetails.high} <FormattedMessage id="bs.mgdl" />
                  </>
                )}
              </BodyText>
            ),
          }}
        />
      </BodyText>
    ) : (
      <BodyText>
        <FormattedMessage
          id="general.sheet-normal-disclaimer"
          values={{
            label: <FormattedMessage id={bsDetails.languageTypeCode} />,
            limit: (
              <BodyText>
                {bs.blood_sugar_type === BLOOD_SUGAR_TYPES.HEMOGLOBIC ? (
                  <>
                    {bsDetails.high}
                    <BodyText>%</BodyText>
                  </>
                ) : (
                  <>
                    {bsDetails.high} <FormattedMessage id="bs.mgdl" />
                  </>
                )}
              </BodyText>
            ),
          }}
        />
      </BodyText>
    )
  }

  const details = getBloodSugarDetails(bs)
  return (
    <TouchableWithoutFeedback
      onPress={(e) => {
        e.stopPropagation()
        e.preventDefault()
      }}>
      <View
        style={{
          padding: 24,
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
          <View style={{paddingLeft: 16, width: '90%'}}>
            <BodyText
              style={{
                lineHeight: 26,
                paddingTop: 12,
                fontSize: 18,
                color: colors.grey0,
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
        <BodyText style={{lineHeight: 26, marginVertical: 34}}>
          {getNotes()}
        </BodyText>
        <View style={{flexDirection: 'row'}}>
          <Button
            style={[
              {
                flex: 1,
              },
            ]}
            buttonType={ButtonType.LightBlue}
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
              buttonType={ButtonType.Delete}
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
                      style: 'destructive',
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
