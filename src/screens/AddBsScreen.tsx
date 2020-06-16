import React, {useState, useContext, useRef, useEffect} from 'react'
import {
  SafeAreaView,
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {useIntl, FormattedMessage} from 'react-intl'
import {Item} from 'react-native-picker-select'

import {containerStyles, colors} from '../styles'
import {Picker, BodyText, Button, ButtonType} from '../components'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'

import {
  BLOOD_SUGAR_TYPES,
  BloodSugar,
} from '../redux/blood-sugar/blood-sugar.models'
import {useThunkDispatch} from '../redux/store'
import {addBloodSugar} from '../redux/blood-sugar/blood-sugar.actions'
import {ScrollView} from 'react-native-gesture-handler'

import {isHighBloodSugar, isLowBloodSugar} from '../utils/blood-sugars'

type AddBsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.ADD_BS
>

type AddBsScreen = RouteProp<RootStackParamList, SCREENS.ADD_BS>

type Props = {
  navigation: AddBsScreenNavigationProp
  route: AddBsScreen
}

interface PickerItemExtended extends Item {
  min: number
  max: number
  type: string
}

enum INPUT_TYPES {
  DECIMAL = 'DECIMAL',
  PERCENTAGE = 'PERCENTAGE',
}

function AddBsScreen({navigation, route}: Props) {
  const intl = useIntl()

  const dispatch = useThunkDispatch()

  const SUGAR_TYPES: PickerItemExtended[] = [
    {
      label: intl.formatMessage({id: 'bs.random-blood-sugar'}),
      value: BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR,
      min: 30,
      max: 1000,
      type: INPUT_TYPES.DECIMAL,
    },
    {
      label: intl.formatMessage({id: 'bs.fasting-blood-sugar'}),
      value: BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR,
      min: 30,
      max: 1000,
      type: INPUT_TYPES.DECIMAL,
    },
    {
      label: intl.formatMessage({id: 'bs.post-prandial'}),
      value: BLOOD_SUGAR_TYPES.POST_PRANDIAL,
      min: 30,
      max: 1000,
      type: INPUT_TYPES.DECIMAL,
    },
    {
      label: intl.formatMessage({id: 'bs.hemoglobic'}),
      value: BLOOD_SUGAR_TYPES.HEMOGLOBIC,
      min: 3,
      max: 25,
      type: INPUT_TYPES.PERCENTAGE,
    },
  ]

  const [type, setType] = useState<string>(SUGAR_TYPES[0].value)
  const [reading, setReading] = useState<string>('')
  const [errors, setErrors] = useState<null | string>(null)
  const inputRef = useRef<null | any>(null)

  const [showErrors, setShowErrors] = useState(false)

  const readingPrevious = useRef(reading)

  const getErrors = (input: string) => {
    if (input === '') {
      return null
    }

    const foundType = SUGAR_TYPES.find((sugarType) => {
      return sugarType.value === type
    })

    if (foundType) {
      const isPercentage = foundType.type === INPUT_TYPES.PERCENTAGE

      if (Number(input) < foundType.min) {
        return intl.formatMessage(
          {id: 'add-bs.bs-less-than-error'},
          {value: `${foundType.min}${isPercentage ? '%' : ''}`},
        )
      } else if (Number(input) > foundType.max) {
        return intl.formatMessage(
          {id: 'add-bs.bs-more-than-error'},
          {value: `${foundType.max}${isPercentage ? '%' : ''}`},
        )
      }
    }

    return null
  }

  useEffect(() => {
    setErrors(getErrors(reading))
  }, [type])

  useEffect(() => {
    let errorShowTimeout: any = null

    if (reading !== readingPrevious.current) {
      clearTimeout(errorShowTimeout)
    }

    if (errors) {
      errorShowTimeout = setTimeout(() => setShowErrors(true), 1500)
    } else {
      setShowErrors(false)
    }

    readingPrevious.current = reading

    return () => {
      clearTimeout(errorShowTimeout)
    }
  }, [errors, reading])

  const isSaveDisabled = (): boolean => {
    return !!(reading === '' || errors || isNaN(Number(reading)))
  }

  const cleanText = (input: string) => {
    if (type === BLOOD_SUGAR_TYPES.HEMOGLOBIC) {
      return input.replace(/[^0-9.]/g, '')
    }
    return input.replace(/[^0-9]/g, '')
  }

  return (
    <View style={{flex: 1}}>
      <SafeAreaView
        style={[containerStyles.fill, {backgroundColor: colors.white100}]}>
        <ScrollView
          style={{
            flex: 1,
            padding: 24,
          }}
          keyboardShouldPersistTaps="handled">
          <View
            style={{
              position: 'relative',
              marginBottom: 24,
            }}>
            <TextInput
              style={[styles.input]}
              ref={inputRef}
              onFocus={() => {
                inputRef.current.setNativeProps({
                  borderColor: colors.blue2,
                })
              }}
              onBlur={() => {
                inputRef.current.setNativeProps({
                  borderColor: colors.grey2,
                })
              }}
              autoFocus={true}
              placeholder={intl.formatMessage({id: 'bs.blood-sugar'})}
              placeholderTextColor={colors.grey1}
              value={reading}
              onChangeText={(textIn) => {
                const text = cleanText(textIn)

                setReading(text)
                if (text === '') {
                  setErrors(null)
                } else if (text !== '') {
                  setErrors(getErrors(text))
                }
              }}
              keyboardType={
                type === BLOOD_SUGAR_TYPES.HEMOGLOBIC ? 'numeric' : 'number-pad'
              }
              maxLength={6}
            />
            <BodyText
              style={{
                position: 'absolute',
                right: 12,
                top: 14,
                color: colors.grey1,
              }}>
              {type === BLOOD_SUGAR_TYPES.HEMOGLOBIC ? (
                '%'
              ) : (
                <FormattedMessage id="bs.mgdl" />
              )}
            </BodyText>
          </View>
          <Picker
            value={type}
            items={SUGAR_TYPES}
            onValueChange={(value: string) => {
              setType(value)
            }}
          />
          <Button
            title={intl.formatMessage({id: 'general.save'})}
            disabled={isSaveDisabled()}
            buttonType={ButtonType.Normal}
            style={{
              marginTop: 24,
            }}
            onPress={() => {
              const newBloodSugar: BloodSugar = {
                blood_sugar_type: type,
                blood_sugar_value: reading,
                offline: true,
                recorded_at: new Date().toISOString(),
              }

              dispatch(addBloodSugar(newBloodSugar))

              navigation.goBack()

              if (isHighBloodSugar(newBloodSugar)) {
                setTimeout(() => {
                  navigation.navigate(SCREENS.ADD_DATA_WARNING_MODAL_SCREEN)
                }, 250)
              } else if (isLowBloodSugar(newBloodSugar)) {
                setTimeout(() => {
                  navigation.navigate(SCREENS.ADD_DATA_WARNING_MODAL_SCREEN)
                }, 250)
              }
            }}
          />
          {!errors && !showErrors && reading === '' && (
            <BodyText
              style={{
                textAlign: 'center',
                marginTop: 24,
                color: colors.grey1,
              }}>
              <FormattedMessage id="bs.select-rbs-if-unsure" />
            </BodyText>
          )}
          {errors && showErrors && (
            <BodyText
              style={{
                textAlign: 'center',
                marginTop: 24,
                color: colors.red1,
              }}>
              {errors}
            </BodyText>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default AddBsScreen

const styles = StyleSheet.create({
  input: {
    position: 'relative',
    height: 56,
    borderRadius: 4,
    backgroundColor: colors.white100,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.grey3,
    padding: 16,
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0.5,
    color: colors.grey0,
  },
})
