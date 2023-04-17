import React, { useState, useRef, useEffect, useCallback } from 'react'
import { View, StyleSheet, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useIntl } from 'react-intl'

import { containerStyles, colors } from '../styles'
import { Button, BodyText, ButtonType } from '../components'
import SCREENS from '../constants/screens'
import { RootStackParamList } from '../navigation/Navigation'
import {
  HasReviewedSelector,
  NormalBpBsCountSelector,
} from '../redux/patient/patient.selectors'

import { BloodPressure } from '../redux/blood-pressure/blood-pressure.models'
import { useThunkDispatch } from '../redux/store'
import { addBloodPressure } from '../redux/blood-pressure/blood-pressure.actions'
import { setNormalBpBsCount } from '../redux/patient/patient.actions'
import { BloodPressuresSelector } from '../redux/blood-pressure/blood-pressure.selectors'
import { BloodSugarsSelector } from '../redux/blood-sugar/blood-sugar.selectors'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

type AddBpScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.ADD_BP
>

type AddBpScreen = RouteProp<RootStackParamList, SCREENS.ADD_BP>

type Props = {
  navigation: AddBpScreenNavigationProp
  route: AddBpScreen
}

const MIN_SYSTOLIC_BP = 70
const MAX_SYSTOLIC_BP = 300
const MIN_DIASTOLIC_BP = 40
const MAX_DIASTOLIC_BP = 180

const getHistoricValues = (): number => {
  const bpsAll = BloodPressuresSelector() ?? []
  const normalBpCount = bpsAll.length

  const bsAll = BloodSugarsSelector() ?? []
  const normalBsCount = bsAll.length

  return normalBpCount + normalBsCount
}

const GetBpBsCount = (): number => {
  const count = NormalBpBsCountSelector()
  const historicCount = getHistoricValues()
  const dispatch = useThunkDispatch()

  if (count || count === 0) {
    return count
  }

  dispatch(setNormalBpBsCount(historicCount))

  return historicCount
}

function AddBpScreen({ navigation }: Props) {
  const intl = useIntl()
  const hasReviewed = HasReviewedSelector()
  const normalBpBsCount = GetBpBsCount()

  const systolicRef = useRef<null | TextInput>(null)
  const diastolicRef = useRef<null | TextInput>(null)

  const [saveIsDisabled, setSaveIsDisabled] = useState(true)

  const [systolic, setSystolic] = useState('')
  const [diastolic, setDiastolic] = useState('')
  const [errors, setErrors] = useState<null | string>(null)

  const systolicPrevious = useRef(systolic)
  const diastolicPrevious = useRef(diastolic)
  const [showErrors, setShowErrors] = useState(false)

  const dispatch = useThunkDispatch()

  const refreshSaveDisabled = useCallback(() => {
    const saveIsDisabledNow = !!(
      systolic === '' ||
      diastolic === '' ||
      errors ||
      isNaN(Number(systolic)) ||
      isNaN(Number(diastolic))
    )
    if (saveIsDisabledNow !== saveIsDisabled) {
      setSaveIsDisabled(saveIsDisabledNow)
    }
  }, [diastolic, systolic, errors, saveIsDisabled])

  const getErrorGateway = (
    systolicInput: string,
    diastolicInput: string,
  ): void => {
    setErrors(getErrors(systolicInput, diastolicInput))
  }

  const getErrors = (
    systolicInput: string,
    diastolicInput: string,
  ): string | null => {
    if (systolicInput === '' && diastolicInput === '') {
      return null
    }

    if (systolicInput !== '') {
      if (Number(systolicInput) < MIN_SYSTOLIC_BP) {
        return intl.formatMessage({ id: 'add-bp.systolic-less-than-error' })
      } else if (Number(systolicInput) > MAX_SYSTOLIC_BP) {
        return intl.formatMessage({ id: 'add-bp.systolic-greater-than-error' })
      }
    }

    if (diastolicInput !== '') {
      if (Number(diastolicInput) < MIN_DIASTOLIC_BP) {
        return intl.formatMessage({ id: 'add-bp.diastolic-less-than-error' })
      } else if (Number(diastolicInput) > MAX_DIASTOLIC_BP) {
        return intl.formatMessage({
          id: 'add-bp.diastolic-greater-than-error',
        })
      }
    }

    return null
  }

  const showWarning = (bpIn: BloodPressure) => {
    // This is a high blood pressure that is high enough to warrant a warning
    return bpIn.systolic >= 180 || bpIn.diastolic >= 110
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
      if (normalBpBsCount < 4) {
        dispatch(setNormalBpBsCount(normalBpBsCount + 1))
      }
      setTimeout(() => {
        navigation.navigate(SCREENS.ADD_DATA_WARNING_MODAL_SCREEN, {
          displayText: intl.formatMessage(
            { id: 'alert.description-high' },
            { label: intl.formatMessage({ id: 'general.bp' }) },
          ),
        })
      }, 250)
    } else if (!hasReviewed) {
      if (normalBpBsCount >= 4) {
        setTimeout(() => {
          navigation.navigate(SCREENS.WRITE_A_REVIEW_MODAL_SCREEN)
        }, 250)
      } else {
        dispatch(setNormalBpBsCount(normalBpBsCount + 1))
      }
    }
  }

  useEffect(() => {
    let errorShowTimeout: ReturnType<typeof setTimeout> | undefined

    if (
      systolic !== systolicPrevious.current ||
      diastolic !== diastolicPrevious.current
    ) {
      clearTimeout(errorShowTimeout)
    }

    if (errors) {
      errorShowTimeout = setTimeout(() => setShowErrors(true), 1500)
    } else {
      setErrors(null)
      setShowErrors(false)
    }

    systolicPrevious.current = systolic
    diastolicPrevious.current = diastolic

    refreshSaveDisabled()

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

  const systolicLabel = `${intl.formatMessage({
    id: 'general.top',
  })} (${intl.formatMessage({ id: 'general.systolic' })})`
  const diastolicLabel = `${intl.formatMessage({
    id: 'general.bottom',
  })} (${intl.formatMessage({ id: 'general.diastolic' })})`

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView
        style={[containerStyles.fill, { backgroundColor: colors.white100 }]}
      >
        <KeyboardAwareScrollView
          style={{ padding: 24 }}
          extraScrollHeight={44}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flexDirection: 'column', flex: 1 }}>
              <TextInput
                returnKeyType="done"
                maxLength={6}
                placeholderTextColor={colors.grey1}
                autoFocus={true}
                ref={systolicRef}
                onFocus={() => {
                  systolicRef?.current?.setNativeProps({
                    borderColor: colors.blue2,
                    placeholder: '',
                  })
                }}
                onBlur={() => {
                  systolicRef?.current?.setNativeProps({
                    borderColor: colors.grey2,
                    placeholder: '0',
                  })
                }}
                style={[styles.input, { marginRight: 4 }]}
                onChangeText={(text) => {
                  validateInput('systolic', text)
                  getErrorGateway(text, diastolic)
                }}
                // placeholder={}
                placeholder="0"
                value={systolic.toString()}
                keyboardType={'number-pad'}
                onSubmitEditing={() => {
                  if (diastolic === '') {
                    diastolicRef?.current?.focus()
                  } else if (!saveIsDisabled) {
                    save()
                  }
                }}
              />
              <BodyText style={styles.label}>{systolicLabel}</BodyText>
            </View>
            <BodyText style={{ padding: 16, color: colors.grey1 }}>/</BodyText>
            <View style={{ flexDirection: 'column', flex: 1 }}>
              <TextInput
                maxLength={6}
                placeholderTextColor={colors.grey1}
                ref={diastolicRef}
                onFocus={() => {
                  diastolicRef?.current?.setNativeProps({
                    borderColor: colors.blue2,
                    placeholder: '',
                  })
                }}
                onBlur={() => {
                  diastolicRef?.current?.setNativeProps({
                    borderColor: colors.grey2,
                    placeholder: '0',
                  })
                }}
                style={[styles.input, { marginLeft: 4 }]}
                onChangeText={(text) => {
                  validateInput('diastolic', text)
                  getErrorGateway(systolic, text)
                }}
                onKeyPress={({ nativeEvent }) => {
                  if (
                    nativeEvent.key === 'Backspace' &&
                    diastolic.length === 0
                  ) {
                    systolicRef?.current?.focus()
                    setSystolic(
                      systolic.toString().substring(0, systolic.length - 1),
                    )
                  }
                }}
                placeholder="0"
                value={diastolic.toString()}
                keyboardType={'number-pad'}
                returnKeyType={'done'}
                onSubmitEditing={() => {
                  if (!saveIsDisabled) {
                    save()
                  }
                }}
              />
              <BodyText style={styles.label}>{diastolicLabel}</BodyText>
            </View>
          </View>

          <Button
            title={intl.formatMessage({ id: 'general.save' })}
            buttonType={ButtonType.Normal}
            disabled={saveIsDisabled}
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
              }}
            >
              {errors}
            </BodyText>
          )}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </View>
  )
}

export default AddBpScreen

const styles = StyleSheet.create({
  input: {
    minHeight: 56,
    borderRadius: 4,
    backgroundColor: colors.white100,
    borderStyle: 'solid',
    borderBottomWidth: 2,
    borderColor: colors.grey2,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0,
    fontSize: 28,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0.5,
    color: colors.black,
    textAlign: 'center',
  },
  label: {
    marginTop: 6,
    color: colors.grey1,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
})
