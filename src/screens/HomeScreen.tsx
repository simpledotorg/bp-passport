import React, {useContext, useState, useEffect} from 'react'
import {
  Dimensions,
  SafeAreaView,
  View,
  StatusBar,
  ScrollView,
  StyleSheet,
  AppState,
  Platform,
  TouchableHighlight,
} from 'react-native'
import {useIntl, FormattedMessage} from 'react-intl'
import {StackNavigationProp} from '@react-navigation/stack'

import {
  containerStyles,
  colors,
  greyHeart,
  medicineClock,
  medicinePill,
  grayDrop,
} from '../styles'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'
import {
  Button,
  Line,
  BodyHeader,
  BodyText,
  BpInformation,
  MedsInformation,
  ContentLoadingSegment,
  BsInformation,
} from '../components'

import {ContentLoadingSegmentSize} from '../components/content-loading-segment'

import {LoginState, PassportLinkedState} from '../redux/auth/auth.models'
import {useThunkDispatch} from '../redux/store'
import {getPatient} from '../redux/patient/patient.actions'

import {passportLinkedStateSelector} from '../redux/auth/auth.selectors'
import {patientSelector} from '../redux/patient/patient.selectors'
import {bloodPressuresSelector} from '../redux/blood-pressure/blood-pressure.selectors'
import {BloodPressure} from '../redux/blood-pressure/blood-pressure.models'
import {bloodSugarsSelector} from '../redux/blood-sugar/blood-sugar.selectors'
import {BloodSugar} from '../redux/blood-sugar/blood-sugar.models'
import {medicationsSelector} from '../redux/medication/medication.selectors'
import {Medication} from '../redux/medication/medication.models'
import {refreshAllLocalPushReminders} from '../redux/medication/medication.actions'
import {RouteProp} from '@react-navigation/native'

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.HOME
>

type HomeScreenRoute = RouteProp<RootStackParamList, SCREENS.HOME>

type Props = {
  navigation: HomeScreenNavigationProp
  route: HomeScreenRoute
}

const HOME_PAGE_SHOW_LIMIT = 3

function Home({navigation, route}: Props) {
  const dispatch = useThunkDispatch()

  const apiUser = patientSelector()
  const passportLinkedState = passportLinkedStateSelector()

  const bloodPressures = bloodPressuresSelector()
  const bloodSugars = bloodSugarsSelector()
  const medications = medicationsSelector()
  const intl = useIntl()

  const hasPassportLinked =
    passportLinkedState === PassportLinkedState.Linking ||
    passportLinkedState === PassportLinkedState.Linked

  const showLoading = hasPassportLinked && !apiUser

  useEffect(() => {
    // on first load refresh patient data if we have authParams we should refresh the api patient data
    if (
      passportLinkedState === PassportLinkedState.Linking ||
      passportLinkedState === PassportLinkedState.Linked
    ) {
      dispatch(getPatient()).catch((err) => {
        console.log('error loading api patient: ', err)
      })
    }
  }, [])

  useEffect(() => {}, [
    passportLinkedState,
    apiUser,
    bloodPressures,
    medications,
  ])

  const [appState, setAppState] = useState(AppState.currentState)

  useEffect(() => {
    const unsubscribe = AppState.addEventListener('change', (nextAppState) => {
      setAppState(nextAppState)
    })

    return unsubscribe
  }, [])

  const bps: BloodPressure[] = bloodPressures ?? []
  const bss: BloodSugar[] = bloodSugars ?? []
  const meds: Medication[] = medications ?? []

  const medicationDisplayName = (medication: Medication) => {
    let ret = medication.name
    if (medication.dosage) {
      if (ret.length > 0) {
        ret += ' ' + medication.dosage
      }
    }
    return ret
  }

  const showBpHistoryButton = bps.length >= HOME_PAGE_SHOW_LIMIT
  const showBsHistoryButton = bss.length >= HOME_PAGE_SHOW_LIMIT

  useEffect(() => {
    if (
      (Platform.OS === 'ios' && appState === 'active') ||
      Platform.OS === 'android'
    ) {
      if (medications) {
        // todo - optimise...
        refreshAllLocalPushReminders(medications, intl)
      }
    }
  }, [appState, medications])

  return (
    <SafeAreaView
      style={[containerStyles.fill, {backgroundColor: colors.grey4}]}>
      <StatusBar backgroundColor={colors.blue1} barStyle="light-content" />
      <View style={{position: 'absolute', marginTop: -1}}>
        <View style={{backgroundColor: colors.blue1, height: 30}} />
        <View
          style={[
            containerStyles.fill,
            {
              width: 0,
              height: 0,
              marginTop: 0,
              backgroundColor: 'transparent',
              borderStyle: 'solid',
              borderTopWidth: 50,
              borderRightWidth: Dimensions.get('window').width,
              borderBottomWidth: 0,
              borderLeftWidth: 0,
              borderTopColor: colors.blue1,
              borderRightColor: 'transparent',
              borderBottomColor: 'transparent',
              borderLeftColor: colors.blue1,
            },
          ]}
        />
      </View>
      {showLoading && (
        <View style={[containerStyles.fill]}>
          <ContentLoadingSegment size={ContentLoadingSegmentSize.Small} />
          <ContentLoadingSegment size={ContentLoadingSegmentSize.Large} />
          <ContentLoadingSegment size={ContentLoadingSegmentSize.Small} />
        </View>
      )}
      {!showLoading && (
        <>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={[containerStyles.containerSegment]}>
              <BodyHeader
                style={[
                  styles.sectionHeader,
                  !meds.length ? {marginBottom: 8} : {},
                ]}>
                <FormattedMessage id="home.my-medicines" />
              </BodyHeader>
              {meds.length > 0 && (
                <>
                  {meds.map((med, index) => {
                    return (
                      <>
                        <TouchableHighlight
                          underlayColor={colors.grey4}
                          onPress={() => {
                            navigation.navigate(SCREENS.MEDICATION_DETAILS, {
                              medication: med,
                              isEditing: true,
                            })
                          }}
                          key={index}
                          style={[
                            {
                              paddingVertical: 12,
                              marginHorizontal: -24,
                              paddingHorizontal: 24,
                            },
                            styles.historyItem,
                          ]}>
                          <MedsInformation meds={med} />
                        </TouchableHighlight>
                        {index < meds.length - 1 && (
                          <Line key={'line' + index} />
                        )}
                      </>
                    )
                  })}
                </>
              )}
              <View style={{marginTop: 16, flexDirection: 'row'}}>
                <Button
                  style={[
                    styles.bpButton,
                    {
                      marginRight: showBsHistoryButton ? 12 : 0,
                    },
                  ]}
                  buttonColor={colors.blue2}
                  title={intl.formatMessage({id: 'home.add-medicine'})}
                  onPress={() => {
                    navigation.navigate(SCREENS.ADD_MEDICINE)
                  }}
                />
              </View>
            </View>
            <View style={[containerStyles.containerSegment]}>
              <BodyHeader
                style={[
                  styles.sectionHeader,
                  !bps.length ? {marginBottom: 8} : {},
                ]}>
                <FormattedMessage id="home.my-bp" />
              </BodyHeader>
              {bps.length > 0 && (
                <>
                  {bps.map((bp, index) => {
                    if (index > HOME_PAGE_SHOW_LIMIT - 1) {
                      return null
                    }

                    return (
                      <>
                        <TouchableHighlight
                          underlayColor={colors.grey4}
                          onPress={() => {
                            navigation.navigate(SCREENS.DETAILS_MODAL_SCREEN, {
                              bp,
                            })
                          }}
                          key={index}
                          style={[
                            {
                              paddingVertical: 12,
                              marginHorizontal: -24,
                              paddingHorizontal: 24,
                            },
                            styles.historyItem,
                          ]}>
                          <BpInformation bp={bp} />
                        </TouchableHighlight>
                        {index < bps.length - 1 &&
                          index < HOME_PAGE_SHOW_LIMIT - 1 && (
                            <Line key={'line' + index} />
                          )}
                      </>
                    )
                  })}
                </>
              )}
              <View style={{marginTop: 16, flexDirection: 'row'}}>
                <Button
                  style={[
                    styles.bpButton,
                    {
                      marginRight: showBpHistoryButton ? 6 : 0,
                    },
                  ]}
                  buttonColor={colors.blue2}
                  title={intl.formatMessage({
                    id: showBpHistoryButton ? 'home.add' : 'home.add-bp',
                  })}
                  onPress={() => {
                    navigation.navigate(SCREENS.ADD_BP)
                  }}
                />
                {showBpHistoryButton && (
                  <Button
                    style={[
                      styles.bpButton,
                      {
                        marginLeft: 6,
                      },
                    ]}
                    buttonColor={colors.blue2}
                    title={intl.formatMessage({id: 'general.see-all'})}
                    onPress={() => {
                      navigation.navigate(SCREENS.BP_HISTORY, {
                        bps,
                      })
                    }}
                  />
                )}
              </View>
            </View>
            <View style={[containerStyles.containerSegment]}>
              <BodyHeader
                style={[
                  styles.sectionHeader,
                  !bss.length ? {marginBottom: 8} : {},
                ]}>
                <FormattedMessage id="home.my-blood-sugar" />
              </BodyHeader>
              {bss.length > 0 && (
                <>
                  {bss.map((bs, index) => {
                    if (index > HOME_PAGE_SHOW_LIMIT - 1) {
                      return null
                    }

                    return (
                      <>
                        <TouchableHighlight
                          underlayColor={colors.grey4}
                          onPress={() => {
                            navigation.navigate(SCREENS.DETAILS_MODAL_SCREEN, {
                              bs,
                            })
                          }}
                          key={index}
                          style={[
                            {
                              paddingVertical: 12,
                              marginHorizontal: -24,
                              paddingHorizontal: 24,
                            },
                            styles.historyItem,
                            index === bss.length - 1
                              ? {borderBottomWidth: 0}
                              : {},
                          ]}>
                          <BsInformation bs={bs} />
                        </TouchableHighlight>
                        {index < bss.length - 1 &&
                          index < HOME_PAGE_SHOW_LIMIT - 1 && (
                            <Line key={'line' + index} />
                          )}
                      </>
                    )
                  })}
                </>
              )}
              <View style={{marginTop: 16, flexDirection: 'row'}}>
                <Button
                  style={[
                    styles.bpButton,
                    {
                      marginRight: showBsHistoryButton ? 6 : 0,
                    },
                  ]}
                  buttonColor={colors.blue2}
                  title={intl.formatMessage({
                    id: showBsHistoryButton ? 'home.add' : 'home.add-bs',
                  })}
                  onPress={() => {
                    navigation.navigate(SCREENS.ADD_BS)
                  }}
                />
                {showBsHistoryButton && (
                  <Button
                    style={[
                      styles.bpButton,
                      {
                        marginLeft: 6,
                      },
                    ]}
                    buttonColor={colors.blue2}
                    title={intl.formatMessage({id: 'general.see-all'})}
                    onPress={() => {
                      navigation.navigate(SCREENS.BS_HISTORY, {
                        bloodSugars: bss,
                      })
                    }}
                  />
                )}
              </View>
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
  },
  buttonContainer: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: colors.green2,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionText: {
    fontSize: 18,
    fontWeight: '500',
  },
  informationIcon: {
    marginRight: 16,
    flexShrink: 0,
  },
  bpButton: {
    backgroundColor: colors.blue3,

    flex: 1,
  },
  historyItem: {
    /*
    borderTopWidth: 1,
    borderColor: colors.grey3,*/
    flexDirection: 'row',
    alignItems: 'center',
  },
})
