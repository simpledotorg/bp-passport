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
import {useIntl} from 'react-intl'

import {containerStyles, colors} from '../styles'
import {Button, BodyText} from '../components'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'

import {BloodPressure} from '../redux/blood-pressure/blood-pressure.models'
import {useThunkDispatch} from '../redux/store'
import {addBloodPressure} from '../redux/blood-pressure/blood-pressure.actions'

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

  const save = () => {
    const newBloodPressure: BloodPressure = {
      diastolic: Number(diastolic),
      systolic: Number(systolic),
      offline: true,
      recorded_at: new Date().toISOString(),
    }

    dispatch(addBloodPressure(newBloodPressure))

    navigation.goBack()
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
      errorShowTimeout = setTimeout(() => setShowErrors(true), 2000)
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

  return (
    <View style={{flex: 1}}>
      <SafeAreaView
        style={[containerStyles.fill, {backgroundColor: colors.white100}]}>
        <View style={{padding: 24, flex: 1}}>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              maxLength={6}
              placeholderTextColor={colors.grey1}
              autoFocus={true}
              ref={systolicRef}
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
              ref={diastolicRef}
              style={[styles.input, {marginLeft: 4}]}
              onChangeText={(text) => {
                validateInput('diastolic', text)
                getErrorGateway(systolic, text)
              }}
              placeholder={intl.formatMessage({id: 'general.diastolic'})}
              value={diastolic.toString()}
              keyboardType={'number-pad'}
              onSubmitEditing={() => {
                if (!isSaveDisabled()) {
                  save()
                }
              }}
            />
          </View>
          <Button
            title={intl.formatMessage({id: 'general.save'})}
            disabled={isSaveDisabled()}
            style={{
              marginTop: 24,
            }}
            onPress={() => {
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
        </View>
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
