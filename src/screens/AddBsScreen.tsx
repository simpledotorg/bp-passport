import React, {useState, useRef, useEffect} from 'react'
import {
  SafeAreaView,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableHighlight,
} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {useIntl, FormattedMessage} from 'react-intl'
import {Item} from 'react-native-picker-select'

import {containerStyles, colors} from '../styles'
import {Picker, BodyText, Button, ButtonType} from '../components'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'
import Icon from 'react-native-vector-icons/MaterialIcons'

import {
  BLOOD_SUGAR_TYPES,
  BloodSugar,
  BLOOD_SUGAR_INPUT_TYPES,
} from '../redux/blood-sugar/blood-sugar.models'
import {useThunkDispatch} from '../redux/store'
import {addBloodSugar} from '../redux/blood-sugar/blood-sugar.actions'

import {
  isHighBloodSugar,
  isLowBloodSugar,
  showWarning,
  BloodSugarCode,
  convertBloodSugarValue,
  getDisplayBloodSugarUnit,
  determinePrecision,
} from '../utils/blood-sugars'
import {
  hasReviewedSelector,
  normalBpBsCountSelector,
} from '../redux/patient/patient.selectors'
import {setNormalBpBsCount} from '../redux/patient/patient.actions'

import {bloodSugarUnitSelector} from '../redux/patient/patient.selectors'
import {bloodPressuresSelector} from '../redux/blood-pressure/blood-pressure.selectors'
import {bloodSugarsSelector} from '../redux/blood-sugar/blood-sugar.selectors'
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

interface PickerItemExtended extends Item {
  min: number
  max: number
  type: string
}

const getHistoricValues = (): number => {
  const bpsAll = bloodPressuresSelector() ?? []
  const normalBpCount = bpsAll.length

  const bsAll = bloodSugarsSelector() ?? []
  const normalBsCount = bsAll.length

  return normalBpCount + normalBsCount
}

const getBpBsCount = (): number => {
  const count = normalBpBsCountSelector()
  const historicCount = getHistoricValues()

  if (count || count === 0) {
    return count
  }

  const dispatch = useThunkDispatch()

  dispatch(setNormalBpBsCount(historicCount))

  return historicCount
}

const allowDecimalPoint = (
  type: BLOOD_SUGAR_TYPES | undefined,
  selectedBloodSugarUnit: BloodSugarCode,
) => {
  console.log('selectedBloodSugarUnit: ', selectedBloodSugarUnit)
  return (
    type === BLOOD_SUGAR_TYPES.HEMOGLOBIC ||
    selectedBloodSugarUnit === BloodSugarCode.MMOL_L
  )
}

function AddBsScreen({navigation, route}: Props) {
  const intl = useIntl()
  const dispatch = useThunkDispatch()
  const hasReviewed = hasReviewedSelector()
  const normalBpBsCount = getBpBsCount()

  const SUGAR_TYPES: PickerItemExtended[] = [
    {
      label: `${intl.formatMessage({
        id: 'bs.placeholder-title',
      })} (${intl.formatMessage({id: 'bs.placeholder-description'})})`,
      value: null,
      min: 30,
      max: 1000,
      type: BLOOD_SUGAR_INPUT_TYPES.DECIMAL,
    },
    {
      label: intl.formatMessage({id: 'bs.after-eating-title'}),
      value: BLOOD_SUGAR_TYPES.AFTER_EATING,
      min: 30,
      max: 1000,
      type: BLOOD_SUGAR_INPUT_TYPES.DECIMAL,
    },
    {
      label: intl.formatMessage({id: 'bs.before-eating-title'}),
      value: BLOOD_SUGAR_TYPES.BEFORE_EATING,
      min: 30,
      max: 1000,
      type: BLOOD_SUGAR_INPUT_TYPES.DECIMAL,
    },
    {
      label: intl.formatMessage({id: 'bs.hemoglobic'}),
      value: BLOOD_SUGAR_TYPES.HEMOGLOBIC,
      min: 3,
      max: 25,
      type: BLOOD_SUGAR_INPUT_TYPES.PERCENTAGE,
    },
  ]

  // const [type, setType] = useState<string>(SUGAR_TYPES[0].value)
  const [reading, setReading] = useState<string>('')
  const [errors, setErrors] = useState<null | string>(null)
  const inputRef = useRef<null | any>(null)
  const [type, setType] = useState<BLOOD_SUGAR_TYPES | undefined>(undefined)

  // BLOOD_SUGAR_TYPES

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
      intl.formatMessage({id: 'bs.placeholder-description'}) +
      ')'
    )
  }

  const dropdownTitle = typeToTitle(type)

  const [showErrors, setShowErrors] = useState(false)

  const selectedBloodSugarUnit =
    bloodSugarUnitSelector() ?? BloodSugarCode.MG_DL

  const getErrors = (input: string): string | null => {
    if (input === '') {
      return null
    }

    const foundType = SUGAR_TYPES.find((sugarType) => {
      return sugarType.value === type
    })

    if (foundType) {
      const isPercentage = foundType.type === BLOOD_SUGAR_INPUT_TYPES.PERCENTAGE

      const minValue: number = isPercentage
        ? foundType.min
        : Number(
            convertBloodSugarValue(
              selectedBloodSugarUnit,
              foundType.value,
              foundType.min.toString(),
              BloodSugarCode.MG_DL,
            ).toFixed(determinePrecision(selectedBloodSugarUnit)),
          )

      if (Number(input) < minValue) {
        return intl.formatMessage(
          {id: 'add-bs.bs-less-than-error'},
          {value: `${minValue}${isPercentage ? '%' : ''}`},
        )
      }

      const maxValue: number = isPercentage
        ? foundType.max
        : Number(
            convertBloodSugarValue(
              selectedBloodSugarUnit,
              foundType.value,
              foundType.max.toString(),
              BloodSugarCode.MG_DL,
            ).toFixed(determinePrecision(selectedBloodSugarUnit)),
          )

      if (Number(input) > maxValue) {
        return intl.formatMessage(
          {id: 'add-bs.bs-more-than-error'},
          {value: `${maxValue}${isPercentage ? '%' : ''}`},
        )
      }
    }

    return null
  }

  useEffect(() => {
    const newErrors = getErrors(reading)
    if (newErrors !== errors) {
      setErrors(newErrors)
      setShowErrors(newErrors != null)
    }
  }, [type])

  useEffect(() => {
    if (reading === '') {
      if (errors != null) {
        setErrors(null)
        setShowErrors(false)
      }
      return
    }

    const newErrors = getErrors(reading)

    if (newErrors === null) {
      if (showErrors) {
        setShowErrors(false)
      }

      if (errors != null) {
        setErrors(null)
      }

      return
    }

    if (newErrors !== errors) {
      setErrors(newErrors)
    }

    const errorShowTimeout = setTimeout(() => {
      setShowErrors(true)
    }, 1500)

    return () => {
      clearTimeout(errorShowTimeout)
    }
  }, [reading])

  const isSaveDisabled = (): boolean => {
    return !!(reading === '' || errors || isNaN(Number(reading)))
  }

  const cleanText = (input: string) => {
    let ret = input
    if (type && allowDecimalPoint(type, selectedBloodSugarUnit)) {
      ret = ret.replace(/[^0-9.]/g, '')
    } else {
      ret = ret.replace(/[^0-9]/g, '')
    }

    switch (type) {
      case BLOOD_SUGAR_TYPES.HEMOGLOBIC:
        break
      default:
        if (selectedBloodSugarUnit === BloodSugarCode.MG_DL) {
          const v = parseInt(ret, 10)
          if (v > 1000) {
            ret = '1000'
          }
        } else if (selectedBloodSugarUnit === BloodSugarCode.MMOL_L) {
          const v = parseFloat(ret)
          if (v > 55.5) {
            ret = '55.5'
          }
        }
        break
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
              flexDirection: 'column',
              flex: 1,
              alignItems: 'center',
              marginBottom: 32,
            }}>
            <TextInput
              maxLength={6}
              placeholderTextColor={colors.grey1}
              autoFocus={true}
              ref={inputRef}
              onFocus={() => {
                inputRef.current.setNativeProps({
                  borderColor: colors.blue2,
                  placeholder: '',
                })
              }}
              onBlur={() => {
                inputRef.current.setNativeProps({
                  borderColor: colors.grey2,
                })
              }}
              style={[styles.input, {marginRight: 4}]}
              onChangeText={(textIn) => {
                const text = setReading(cleanText(textIn))
              }}
              // placeholder={}

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
                navigation.navigate(SCREENS.BS_TYPE, {updateType, type})
              }}
              underlayColor={colors.grey4}>
              <View style={styles.dropdown}>
                <BodyText style={styles.dropdownLabel}>
                  {dropdownTitle}
                </BodyText>
                <Icon name="expand-more" size={30} color={colors.grey1} />
              </View>
            </TouchableHighlight>
          </View>
          {/* 
          <Picker
            value={type}
            items={SUGAR_TYPES}
            onValueChange={(value: string) => {
              setType(value)
            }}
          />*/}
          <Button
            title={intl.formatMessage({id: 'general.save'})}
            disabled={isSaveDisabled()}
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
                        {id: 'alert.description-high'},
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
    height: 56,
    width: 144,
    borderRadius: 4,
    backgroundColor: colors.white100,
    borderStyle: 'solid',
    borderBottomWidth: 2,
    borderColor: colors.grey2,
    padding: 16,
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
