import React, {useState, useContext, useRef} from 'react'
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

  const dispatch = useThunkDispatch()

  const isSaveDisabled = () => {
    return !!(systolic === '' || diastolic === '' || errors)
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

  return (
    <View style={{flex: 1}}>
      <SafeAreaView
        style={[containerStyles.fill, {backgroundColor: colors.white100}]}>
        <TouchableWithoutFeedback
          style={{flex: 1, backgroundColor: 'blue'}}
          onPress={() => {
            if (systolicRef?.current?.blur) {
              systolicRef?.current?.blur()
            }
            if (diastolicRef?.current?.blur) {
              diastolicRef?.current?.blur()
            }
          }}>
          <View style={{padding: 24, flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <TextInput
                maxLength={6}
                ref={systolicRef}
                style={[styles.input, {marginRight: 4}]}
                onChangeText={(text) => {
                  setSystolic(text)
                  getErrorGateway(text, diastolic)
                }}
                placeholder={intl.formatMessage({id: 'general.systolic'})}
                value={systolic.toString()}
                keyboardType={'numeric'}
              />
              <TextInput
                maxLength={6}
                ref={diastolicRef}
                style={[styles.input, {marginLeft: 4}]}
                onChangeText={(text) => {
                  setDiastolic(text)
                  getErrorGateway(systolic, text)
                }}
                placeholder={intl.formatMessage({id: 'general.diastolic'})}
                value={diastolic.toString()}
                keyboardType={'numeric'}
              />
            </View>
            <Button
              title={intl.formatMessage({id: 'general.save'})}
              disabled={isSaveDisabled()}
              style={{
                marginTop: 24,
              }}
              onPress={() => {
                const newBloodPressure: BloodPressure = {
                  diastolic: Number(diastolic),
                  systolic: Number(systolic),
                  offline: true,
                  recorded_at: new Date().toISOString(),
                }

                dispatch(addBloodPressure(newBloodPressure))

                navigation.goBack()
              }}
            />
            {errors && (
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
        </TouchableWithoutFeedback>
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
