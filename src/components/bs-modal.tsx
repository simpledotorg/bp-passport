import React from 'react'
import {
  View,
  StyleSheet,
  Image,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native'
import {FormattedMessage, useIntl} from 'react-intl'
import {colors, purpleDrop, mediumWarningSign} from '../styles'
import {BodyHeader, BodyText, Button} from './'
import {BLOOD_SUGAR_TYPES} from '../redux/blood-sugar/blood-sugar.models'
import {
  isHighBloodSugar,
  isLowBloodSugar,
  showWarning,
  getBloodSugarDetails,
  getDisplayBloodSugarUnit,
  BloodSugarCode,
  convertBloodSugarValue,
  getReadingTypeId,
  getReadingType,
  determinePrecision,
} from '../utils/blood-sugars'
import {useThunkDispatch} from '../redux/store'
import {deleteBloodSugar} from '../redux/blood-sugar/blood-sugar.actions'
import {ButtonType} from './button'
import {format} from 'date-fns'
import {dateLocale} from '../constants/languages'
import ConvertedBloodSugarReading from '../models/converted_blood_sugar_reading'

type Props = {
  bs: ConvertedBloodSugarReading
  displayUnits: BloodSugarCode
  close: () => void
}

const displayDateAndTime = (bsIn: ConvertedBloodSugarReading) => {
  return bsIn.recorded_at
    ? format(new Date(bsIn.recorded_at), `dd-MMM-yyy, h:mm a`, {
        locale: dateLocale(),
      })
    : null
}

const ValueStatusLabel = ({bs}: any) => {
  if (isHighBloodSugar(bs)) {
    return (
      <BodyText
        style={[
          styles.bsText,
          {
            color: colors.red1,
          },
        ]}>
        <FormattedMessage id="general.high" />
      </BodyText>
    )
  }

  if (isLowBloodSugar(bs)) {
    return (
      <BodyText
        style={[
          styles.bsText,
          {
            color: colors.red1,
          },
        ]}>
        <FormattedMessage id="general.low" />
      </BodyText>
    )
  }

  return (
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

const HighBloodSugarWarning = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 34,
      }}>
      <Image source={mediumWarningSign} />
      <View style={{flexDirection: 'column', flex: 1, paddingLeft: 16}}>
        <BodyText
          style={{
            color: colors.grey0,
            fontWeight: 'bold',
            fontSize: 18,
            lineHeight: 26,
          }}>
          <FormattedMessage id="alert.title" />
        </BodyText>
        <BodyText
          style={{
            lineHeight: 26,
          }}>
          <FormattedMessage
            id="alert.description-high"
            values={{
              label: <FormattedMessage id={'bs.blood-sugar'} />,
            }}
          />
        </BodyText>
      </View>
    </View>
  )
}

const LowBloodSugarWarning = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 34,
      }}>
      <Image source={mediumWarningSign} />
      <View style={{flexDirection: 'column', flex: 1, paddingLeft: 16}}>
        <BodyText
          style={{
            color: colors.grey0,
            fontWeight: 'bold',
            fontSize: 18,
            lineHeight: 26,
          }}>
          <FormattedMessage id="alert.title" />
        </BodyText>
        <BodyText
          style={{
            lineHeight: 26,
          }}>
          <FormattedMessage id="alert.description-low" />
        </BodyText>
      </View>
    </View>
  )
}

const NormalBloodSugarDisclaimer = ({bs, displayUnits}: any) => {
  const bsDetails = getBloodSugarDetails(bs)

  const getNormalLimit = () => {
    if (bs.blood_sugar_type === BLOOD_SUGAR_TYPES.HEMOGLOBIC) {
      return `${bsDetails.high} %`
    }

    const convertedValue = convertBloodSugarValue(
      displayUnits,
      bsDetails.type,
      bsDetails.high.toString(),
      BloodSugarCode.MG_DL,
    ).toFixed(determinePrecision(displayUnits))
    return `${convertedValue} ${getDisplayBloodSugarUnit(displayUnits)}`
  }
  return (
    <BodyText style={{lineHeight: 26, marginVertical: 34}}>
      <FormattedMessage
        id="general.sheet-normal-disclaimer"
        values={{
          label: <FormattedMessage id={getReadingTypeId(bs)} />,
          limit: <BodyText>{getNormalLimit()}</BodyText>,
        }}
      />
    </BodyText>
  )
}

const BloodSugarNotes = ({bs, displayUnits}: any) => {
  if (isHighBloodSugar(bs) && showWarning(bs)) {
    return <HighBloodSugarWarning />
  }

  return isLowBloodSugar(bs) && showWarning(bs) ? (
    <LowBloodSugarWarning />
  ) : (
    <NormalBloodSugarDisclaimer bs={bs} displayUnits={displayUnits} />
  )
}
const CloseButton = ({intl, close}: any) => {
  return (
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
  )
}

const DeleteButton = ({intl, bs, close}: any) => {
  const dispatch = useThunkDispatch()
  return (
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
  )
}

const getReadingUnits = (
  bloodSugar: ConvertedBloodSugarReading,
  units: BloodSugarCode,
) => {
  return bloodSugar.blood_sugar_type === BLOOD_SUGAR_TYPES.HEMOGLOBIC
    ? '% '
    : getDisplayBloodSugarUnit(units)
}

export const BsModal: (Props: Props) => any = ({
  bs,
  displayUnits,
  close,
}: Props) => {
  const intl = useIntl()

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
          <View style={{paddingLeft: 16, flex: 1}}>
            <BodyText
              style={{
                lineHeight: 26,
                fontSize: 18,
                color: colors.grey0,
              }}>
              {`${bs.value} ${getReadingUnits(bs, displayUnits)} `}
              <ValueStatusLabel bs={bs} />
            </BodyText>
            <BodyText
              style={{
                lineHeight: 20,
                fontSize: 14,
                color: colors.grey1,
                fontWeight: 'bold',
              }}>
              {getReadingType(bs)}
            </BodyText>
            <BodyText
              style={{
                lineHeight: 20,
                fontSize: 14,
                color: colors.grey1,
              }}>
              {`${displayDateAndTime(bs)}`}
            </BodyText>
            {bs.facility && (
              <BodyText style={{lineHeight: 26, paddingTop: 8}}>
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
        <BloodSugarNotes bs={bs} displayUnits={displayUnits} />
        <View style={{flexDirection: 'row'}}>
          <CloseButton close={close} intl={intl} />
          {bs.offline && <DeleteButton close={close} bs={bs} intl={intl} />}
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
