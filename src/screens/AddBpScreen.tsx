import React, {useState, useContext, useRef, useEffect} from 'react'
import {
  SafeAreaView,
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {useIntl} from 'react-intl'

import {containerStyles, colors} from '../styles'
import {Button, BodyText, ButtonType} from '../components'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'

import {BloodPressure} from '../redux/blood-pressure/blood-pressure.models'
import {useThunkDispatch} from '../redux/store'
import {addBloodPressure} from '../redux/blood-pressure/blood-pressure.actions'
import {ScrollView} from 'react-native-gesture-handler'

type AddBpScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.ADD_BP
>

type AddBpScreen = RouteProp<RootStackParamList, SCREENS.ADD_BP>

type Props = {
  navigation: AddBpScreenNavigationProp
  route: AddBpScreen
}

const MIN_SYSTOLIC_BP = 70 // Potentially change to 70
const MAX_SYSTOLIC_BP = 300
const MIN_DIASTOLIC_BP = 40 // Potentially change to 40
const MAX_DIASTOLIC_BP = 180

function AddBpScreen({navigation, route}: Props) {
  const intl = useIntl()

  const systolicRef = useRef<null | any>(null)
  const diastolicRef = useRef<null | any>(null)

  const [systolic, setSystolic] = useState('')
  const [diastolic, setDiastolic] = useState('')
  const [errors, setErrors] = useState<null | string>(null)

  const systolicPrevious = useRef(systolic)
  const diastolicPrevious = useRef(diastolic)
  const [showErrors, setShowErrors] = useState(false)

  const dispatch = useThunkDispatch()

  const isSaveDisabled = () => {
    return !!(
      systolic === '' ||
      diastolic === '' ||
      errors ||
      isNaN(Number(systolic)) ||
      isNaN(Number(diastolic))
    )
  }

  const getErrorGateway = (systolicInput: string, diastolicInput: string) => {
    setErrors(getErrors(systolicInput, diastolicInput))
  }

  const getErrors = (systolicInput: string, diastolicInput: string) => {
    if (systolicInput === '' && diastolicInput === '') {
      return null
    }

    if (systolicInput !== '') {
      if (Number(systolicInput) < MIN_SYSTOLIC_BP) {
        return intl.formatMessage({id: 'add-bp.systolic-less-than-error'})
      } else if (Number(systolicInput) > MAX_SYSTOLIC_BP) {
        return intl.formatMessage({id: 'add-bp.systolic-greater-than-error'})
      }
    }

    if (diastolicInput !== '') {
      if (Number(diastolicInput) < MIN_DIASTOLIC_BP) {
        return intl.formatMessage({id: 'add-bp.diastolic-less-than-error'})
      } else if (Number(diastolicInput) > MAX_DIASTOLIC_BP) {
        return intl.formatMessage({id: 'add-bp.diastolic-greater-than-error'})
      }
    }

    return null
  }

  const showWarning = (bpIn: BloodPressure) => {
    // This is a high blood pressure that is high enough to warrant a warning
    return bpIn.systolic >= 180 || bpIn.diastolic >= 110
  }

  const isBloodPressureHigh = (bpIn: BloodPressure) => {
    // A “High BP” is a BP whose Systolic value is greater than or equal to 140 or whose
    // Diastolic value is greater than or equal to 90. All other BPs are “Normal BP”.
    return bpIn.systolic >= 140 || bpIn.diastolic >= 90
  }

  const save = () => {
    const newBloodPressure: BloodPressure = {
      diastolic: Number(diastolic),
      systolic: Number(systolic),
      offline: true,
      recorded_at: new Date().toISOString(),
    }

    dispatch(addBloodPressure(newBloodPressure))

    navigation.goBack()

    if (showWarning(newBloodPressure)) {
      setTimeout(() => {
        navigation.navigate(SCREENS.ADD_DATA_WARNING_MODAL_SCREEN, {
          displayText: intl.formatMessage(
            {id: 'alert.description-high'},
            {label: intl.formatMessage({id: 'general.bp'})},
          ),
        })
      }, 250)
    }
  }

  useEffect(() => {
    let errorShowTimeout: any = null

    if (
      systolic !== systolicPrevious.current ||
      diastolic !== diastolicPrevious.current
    ) {
      clearTimeout(errorShowTimeout)
    }

    if (errors) {
      errorShowTimeout = setTimeout(() => setShowErrors(true), 1500)
    } else {
      setShowErrors(false)
    }

    systolicPrevious.current = systolic
    diastolicPrevious.current = diastolic

    return () => {
      clearTimeout(errorShowTimeout)
    }
  }, [errors, systolic, diastolic])

  const validateInput = (inputType: string, input: string) => {
    inputType === 'systolic'
      ? setSystolic(input.replace(/[^0-9]/g, ''))
      : setDiastolic(input.replace(/[^0-9]/g, ''))
  }

  useEffect(() => {
    if (systolicRef?.current?.isFocused()) {
      if (systolic.length === 3) {
        if (systolic.match('^[123].*$')) {
          diastolicRef?.current?.focus()
        }
      } else if (systolic.length === 2) {
        if (systolic.match('^[789].*$')) {
          diastolicRef?.current?.focus()
        }
      }
    }
  }, [systolic])

  // paragraph.match(regex)

  return (
    <View style={{flex: 1}}>
      <SafeAreaView
        style={[containerStyles.fill, {backgroundColor: colors.white100}]}>
        <ScrollView
          style={{padding: 24, flex: 1}}
          keyboardShouldPersistTaps="handled">
          <View style={{flexDirection: 'row'}}>
            <TextInput
              returnKeyType="done"
              clearButtonMode="always"
              maxLength={6}
              placeholderTextColor={colors.grey1}
              autoFocus={true}
              ref={systolicRef}
              onFocus={() => {
                systolicRef.current.setNativeProps({
                  borderColor: colors.blue2,
                })
              }}
              onBlur={() => {
                systolicRef.current.setNativeProps({
                  borderColor: colors.grey2,
                })
              }}
              style={[styles.input, {marginRight: 4}]}
              onChangeText={(text) => {
                validateInput('systolic', text)
                getErrorGateway(text, diastolic)
              }}
              placeholder={intl.formatMessage({id: 'general.systolic'})}
              value={systolic.toString()}
              keyboardType={'number-pad'}
              onSubmitEditing={() => {
                if (diastolic === '') {
                  diastolicRef?.current?.focus()
                } else if (!isSaveDisabled()) {
                  save()
                }
              }}
            />
            <TextInput
              maxLength={6}
              placeholderTextColor={colors.grey1}
              ref={diastolicRef}
              onFocus={() => {
                diastolicRef.current.setNativeProps({
                  borderColor: colors.blue2,
                })
              }}
              onBlur={() => {
                diastolicRef.current.setNativeProps({
                  borderColor: colors.grey2,
                })
              }}
              style={[styles.input, {marginLeft: 4}]}
              onChangeText={(text) => {
                validateInput('diastolic', text)
                getErrorGateway(systolic, text)
              }}
              placeholder={intl.formatMessage({id: 'general.diastolic'})}
              value={diastolic.toString()}
              keyboardType={'number-pad'}
              returnKeyType={'done'}
              onSubmitEditing={() => {
                if (!isSaveDisabled()) {
                  save()
                }
              }}
            />
          </View>
          <Button
            title={intl.formatMessage({id: 'general.save'})}
            buttonType={ButtonType.Normal}
            disabled={isSaveDisabled()}
            style={{
              marginTop: 24,
            }}
            onPress={() => {
              // console.log('onPress')
              save()
            }}
          />
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

export default AddBpScreen

const styles = StyleSheet.create({
  input: {
    height: 56,
    borderRadius: 4,
    backgroundColor: colors.white100,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.grey2,
    padding: 16,
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0.5,
    color: colors.grey0,
    flex: 1,
  },
})
