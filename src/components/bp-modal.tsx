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

import {colors, redHeart} from '../styles'
import {BodyText, BodyHeader, Button} from './'

import {BloodPressure} from '../redux/blood-pressure/blood-pressure.models'
import {useThunkDispatch} from '../redux/store'
import {deleteBloodPressure} from '../redux/blood-pressure/blood-pressure.actions'

type Props = {
  bp: BloodPressure
  close: () => void
}

export const BpModal = ({bp, close}: Props) => {
  const intl = useIntl()
  const dispatch = useThunkDispatch()

  const isBloodPressureHigh = (bpIn: BloodPressure) => {
    // A “High BP” is a BP whose Systolic value is greater than or equal to 140 or whose
    // Diastolic value is greater than or equal to 90. All other BPs are “Normal BP”.
    return bpIn.systolic >= 140 || bpIn.diastolic >= 90
  }

  const displayDate = (bpIn: BloodPressure) => {
    return bpIn.recorded_at
      ? format(new Date(bpIn.recorded_at), `dd-MMM-yyy '-' HH:mm`)
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
        <FormattedMessage id="general.high" />
      </BodyText>
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

  const getNotes = () => {
    return isBloodPressureHigh(bp) ? (
      <BodyText>
        <FormattedMessage
          id="general.sheet-high-disclaimer"
          values={{
            label: <FormattedMessage id={'general.bp'} />,
            limit: '140/90',
          }}
        />
      </BodyText>
    ) : (
      <BodyText>
        <FormattedMessage
          id="general.sheet-normal-disclaimer"
          values={{
            label: <FormattedMessage id={'general.bp'} />,
            limit: '140/90',
          }}
        />
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
        }}>
        <BodyHeader
          style={{
            fontWeight: 'bold',
            fontSize: 22,
            marginBottom: 16,
          }}>
          <FormattedMessage id="all-bp.bp-details" />
        </BodyHeader>
        <View style={{flexDirection: 'row'}}>
          <Image source={redHeart} />
          <View style={{paddingLeft: 16, width: '90%'}}>
            <BodyText
              style={{
                lineHeight: 26,
                paddingTop: 12,
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
                lineHeight: 26,
                paddingTop: 12,
                fontSize: 16,
                color: colors.grey1,
              }}>
              {displayDate(bp)}
            </BodyText>

            {bp.facility && (
              <BodyText style={{lineHeight: 26, paddingTop: 12}}>
                <FormattedMessage
                  id="general.recorded_at"
                  values={{
                    location: bp.facility?.name,
                  }}
                />
              </BodyText>
            )}

            <BodyText style={{lineHeight: 26, paddingTop: 12}}>
              {getNotes()}
            </BodyText>
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
          {bp.offline && (
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
                  intl.formatMessage({id: 'general.delete'}),
                  intl.formatMessage({id: 'general.delete-bp-confirm'}),
                  [
                    {
                      text: intl.formatMessage({id: 'general.cancel'}),
                    },
                    {
                      text: intl.formatMessage({id: 'general.ok'}),
                      onPress: () => {
                        dispatch(deleteBloodPressure(bp))
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
  bpText: {
    fontWeight: '500',
    fontSize: 18,
    marginLeft: 'auto',
    textAlign: 'center',
  },
})
