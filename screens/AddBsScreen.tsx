import React, { useState, useRef, useEffect, useCallback } from 'react'
import { View, StyleSheet, TextInput, TouchableHighlight } from 'react-native'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useIntl } from 'react-intl'
import { SafeAreaView } from 'react-native-safe-area-context'

import { containerStyles, colors } from '../styles'
import { BodyText, Button, ButtonType } from '../components'
import SCREENS from '../constants/screens'
import { RootStackParamList } from '../navigation/Navigation'
import { MaterialIcons } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {
  BLOOD_SUGAR_TYPES,
  BloodSugar,
} from '../redux/blood-sugar/blood-sugar.models'
import { useThunkDispatch } from '../redux/store'
import { addBloodSugar } from '../redux/blood-sugar/blood-sugar.actions'

import {
  isHighBloodSugar,
  isLowBloodSugar,
  showWarning,
  BloodSugarCode,
  getDisplayBloodSugarUnit,
  mmolToMg,
  mgToMmol,
} from '../utils/blood-sugars'
import {
  HasReviewedSelector,
  NormalBpBsCountSelector,
} from '../redux/patient/patient.selectors'
import { setNormalBpBsCount } from '../redux/patient/patient.actions'

import { BloodSugarUnitSelector } from '../redux/patient/patient.selectors'
import { BloodPressuresSelector } from '../redux/blood-pressure/blood-pressure.selectors'
import { BloodSugarsSelector } from '../redux/blood-sugar/blood-sugar.selectors'
import ConvertedBloodSugarReading from '../models/converted_blood_sugar_reading'

type AddBsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.ADD_BS
>

type AddBsScreen = RouteProp<RootStackParamList, SCREENS.ADD_BS>

type Props = {
  navigation: AddBsScreenNavigationProp
  route: AddBsScreen
}

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

const allowDecimalPoint = (
  type: BLOOD_SUGAR_TYPES | undefined,
  selectedBloodSugarUnit: BloodSugarCode,
) => {
  return (
    type === BLOOD_SUGAR_TYPES.HEMOGLOBIC ||
    selectedBloodSugarUnit === BloodSugarCode.MMOL_L
  )
}

function AddBsScreen({ navigation }: Props) {
  const intl = useIntl()
  const dispatch = useThunkDispatch()
  const hasReviewed = HasReviewedSelector()
  const normalBpBsCount = GetBpBsCount()

  const [reading, setReading] = useState<string>('')
  const [errors, setErrors] = useState<null | string>(null)
  const inputRef = useRef<TextInput>(null)
  const [type, setType] = useState<BLOOD_SUGAR_TYPES | undefined>(undefined)

  const [saveIsDisabled, setSaveIsDisabled] = useState(true)

  const typeToTitle = (t: BLOOD_SUGAR_TYPES | undefined): string => {
    if (t) {
      switch (t) {
        case BLOOD_SUGAR_TYPES.AFTER_EATING:
          return intl.formatMessage({
            id: 'bs.after-eating-title',
          })
        case BLOOD_SUGAR_TYPES.BEFORE_EATING:
          return intl.formatMessage({
            id: 'bs.before-eating-title',
          })
        case BLOOD_SUGAR_TYPES.HEMOGLOBIC:
          return intl.formatMessage({
            id: 'bs.hemoglobic',
          })
      }
    }
    return (
      intl.formatMessage({
        id: 'bs.placeholder-title',
      }) +
      ' (' +
      intl.formatMessage({ id: 'bs.placeholder-description' }) +
      ')'
    )
  }

  const dropdownTitle = typeToTitle(type)

  const [showErrors, setShowErrors] = useState(false)

  const selectedBloodSugarUnit =
    BloodSugarUnitSelector() ?? BloodSugarCode.MG_DL

  const getErrors = useCallback(
    (input: string): string | null => {
      if (input === '') {
        return null
      }

      const t = type ?? BLOOD_SUGAR_TYPES.BEFORE_EATING

      let v = parseFloat(input)

      const isMmol = selectedBloodSugarUnit === BloodSugarCode.MMOL_L

      let min = 30
      let max = 1000

      switch (t) {
        case BLOOD_SUGAR_TYPES.AFTER_EATING:
        case BLOOD_SUGAR_TYPES.BEFORE_EATING:
          if (isMmol) {
            v = mmolToMg(v)
          }
          if (v < min) {
            const minV = isMmol ? mgToMmol(min) : min
            return intl.formatMessage(
              { id: 'add-bs.bs-less-than-error' },
              { value: `${minV}` },
            )
          } else if (v > max) {
            const maxV = isMmol ? mgToMmol(max) : max

            return intl.formatMessage(
              { id: 'add-bs.bs-more-than-error' },
              { value: `${maxV}` },
            )
          }

          break
        case BLOOD_SUGAR_TYPES.HEMOGLOBIC:
          min = 3
          max = 25
          if (v < min) {
            return intl.formatMessage(
              { id: 'add-bs.bs-less-than-error' },
              { value: `${min}%` },
            )
          } else if (v > max) {
            return intl.formatMessage(
              { id: 'add-bs.bs-more-than-error' },
              { value: `${max}%` },
            )
          }
          break
      }

      return null
    },
    [intl, selectedBloodSugarUnit, type],
  )

  useEffect(() => {
    const newErrors = getErrors(reading)
    const hasErrors = newErrors != null
    if (newErrors !== errors) {
      setErrors(newErrors)
      setShowErrors(hasErrors)
    }

    let ret
    let saveIsDisabledNow = false // assume able to save

    if (hasErrors) {
      const errorShowTimeout = setTimeout(() => {
        setShowErrors(true)
      }, 1500)
      ret = () => {
        clearTimeout(errorShowTimeout)
      }
      saveIsDisabledNow = true
    } else {
      // no errors...
      saveIsDisabledNow = !!(reading === '' || isNaN(Number(reading)))
    }

    setSaveIsDisabled(saveIsDisabledNow)

    return ret
  }, [type, reading])

  const cleanText = (input: string) => {
    let ret = input
    if (allowDecimalPoint(type, selectedBloodSugarUnit)) {
      ret = ret.replace(/[^0-9.]/g, '')
    } else {
      ret = ret.replace(/[^0-9]/g, '')
    }

    return ret
  }

  // need to do this way, beause if you change type then react complains that number of called hooks has changed
  let displayUnitLabel = getDisplayBloodSugarUnit(selectedBloodSugarUnit)

  if (type === BLOOD_SUGAR_TYPES.HEMOGLOBIC) {
    displayUnitLabel = '%'
  }

  const updateType = (t: BLOOD_SUGAR_TYPES) => {
    setType(t)
  }

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView
        style={[containerStyles.fill, { backgroundColor: colors.white100 }]}
      >
        <KeyboardAwareScrollView
          style={{
            padding: 24,
          }}
          extraScrollHeight={44}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              flexDirection: 'column',
              flex: 1,
              alignItems: 'center',
              marginBottom: 32,
            }}
          >
            <TextInput
              maxLength={6}
              placeholderTextColor={colors.grey1}
              autoFocus={true}
              ref={inputRef}
              onFocus={() => {
                inputRef?.current?.setNativeProps({
                  borderColor: colors.blue2,
                  placeholder: '',
                })
              }}
              onBlur={() => {
                inputRef?.current?.setNativeProps({
                  borderColor: colors.grey2,
                })
              }}
              style={[styles.input, { marginRight: 4 }]}
              onChangeText={(textIn) => {
                setReading(cleanText(textIn))
              }}
              value={reading}
              keyboardType={
                allowDecimalPoint(type, selectedBloodSugarUnit)
                  ? 'numeric'
                  : 'number-pad'
              }
            />
            <BodyText style={styles.label}>{displayUnitLabel}</BodyText>
          </View>
          <View style={styles.dropdownBorder}>
            <TouchableHighlight
              onPress={() => {
                navigation.navigate(SCREENS.BS_TYPE, { updateType, type })
              }}
              underlayColor={colors.grey4}
            >
              <View style={styles.dropdown}>
                <BodyText style={styles.dropdownLabel}>
                  {dropdownTitle}
                </BodyText>
                <MaterialIcons
                  name="expand-more"
                  size={30}
                  color={colors.grey1}
                />
              </View>
            </TouchableHighlight>
          </View>
          <Button
            title={intl.formatMessage({ id: 'general.save' })}
            disabled={saveIsDisabled}
            buttonType={ButtonType.Normal}
            style={{
              marginTop: 24,
            }}
            onPress={() => {
              const newBloodSugar: BloodSugar = {
                blood_sugar_type: type ?? BLOOD_SUGAR_TYPES.AFTER_EATING,
                blood_sugar_value: reading,
                offline: true,
                recorded_at: new Date().toISOString(),
                blood_sugar_unit: selectedBloodSugarUnit,
              }

              const convertedValue = new ConvertedBloodSugarReading(
                newBloodSugar,
                selectedBloodSugarUnit,
              )

              dispatch(addBloodSugar(newBloodSugar))

              navigation.goBack()

              if (showWarning(convertedValue)) {
                if (normalBpBsCount < 4) {
                  dispatch(setNormalBpBsCount(normalBpBsCount + 1))
                }
                if (isHighBloodSugar(convertedValue)) {
                  setTimeout(() => {
                    navigation.navigate(SCREENS.ADD_DATA_WARNING_MODAL_SCREEN, {
                      displayText: intl.formatMessage(
                        { id: 'alert.description-high' },
                        {
                          label: intl
                            .formatMessage({
                              id: 'bs.blood-sugar',
                            })
                            .toLowerCase(),
                        },
                      ),
                    })
                  }, 250)
                } else if (isLowBloodSugar(convertedValue)) {
                  setTimeout(() => {
                    navigation.navigate(SCREENS.ADD_DATA_WARNING_MODAL_SCREEN, {
                      displayText: intl.formatMessage({
                        id: 'alert.description-low',
                      }),
                    })
                  }, 250)
                }
              } else if (!hasReviewed) {
                if (normalBpBsCount >= 4) {
                  setTimeout(() => {
                    navigation.navigate(SCREENS.WRITE_A_REVIEW_MODAL_SCREEN)
                  }, 250)
                } else {
                  dispatch(setNormalBpBsCount(normalBpBsCount + 1))
                }
              }
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

export default AddBsScreen

const styles = StyleSheet.create({
  input: {
    minHeight: 56,
    width: 144,
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
  dropdownBorder: {
    borderColor: colors.grey3,
    borderWidth: 1,
    borderRadius: 4,
  },
  dropdown: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.grey3,
    borderWidth: 1,
    borderRadius: 4,
  },
  dropdownLabel: {
    color: colors.grey0,
    fontSize: 16,
    flex: 1,
  },
})
