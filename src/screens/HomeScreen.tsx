import React, {useContext, useState, useEffect} from 'react'
import {
  Dimensions,
  SafeAreaView,
  View,
  StatusBar,
  ScrollView,
  StyleSheet,
  Image,
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
  BodyHeader,
  BodyText,
  BpInformation,
  ContentLoadingSegment,
  BsInformation,
} from '../components'

import {ContentLoadingSegmentSize} from '../components/content-loading-segment'

import {LoginState} from '../redux/auth/auth.models'
import {useThunkDispatch} from '../redux/store'
import {getPatient} from '../redux/patient/patient.actions'

import {
  loginStateSelector,
  authParamsSelector,
} from '../redux/auth/auth.selectors'
import {patientSelector} from '../redux/patient/patient.selectors'
import {bloodPressuresSelector} from '../redux/blood-pressure/blood-pressure.selectors'
import {BloodPressure} from '../redux/blood-pressure/blood-pressure.models'
import {bloodSugarsSelector} from '../redux/blood-sugar/blood-sugar.selectors'
import {BloodSugar} from '../redux/blood-sugar/blood-sugar.models'
import {medicationsSelector} from '../redux/medication/medication.selectors'
import {Medication} from '../redux/medication/medication.models'

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.HOME
>

type Props = {
  navigation: HomeScreenNavigationProp
}

const HOME_PAGE_SHOW_LIMIT = 3

function Home({navigation}: Props) {
  const dispatch = useThunkDispatch()

  const loginState = loginStateSelector()
  const apiUser = patientSelector()
  const authParams = authParamsSelector()

  // console.log('loginState', loginState)

  const bloodPressures = bloodPressuresSelector()
  const bloodSugars = bloodSugarsSelector()
  const medications = medicationsSelector()
  const intl = useIntl()

  const showLoading = loginState === LoginState.LoggingIn

  useEffect(() => {
    // on first load refresh patient data if we have authParams we should refresh the api patient data
    if (authParams) {
      dispatch(getPatient()).catch((err) => {
        console.log('error loading api patient: ', err)
      })
    }
  }, [authParams])

  useEffect(() => {}, [loginState, apiUser, bloodPressures, medications])

  const bps: BloodPressure[] = bloodPressures ?? []
  const bss: BloodSugar[] = bloodSugars ?? []

  const meds: Medication[] = medications ?? []

  const hasMedicines = meds.length > 0

  const medicationDisplayName = (medication: Medication) => {
    let ret = medication.name
    if (medication.dosage) {
      if (ret.length > 0) {
        ret += ' ' + medication.dosage
      }
    }
    return ret
  }

  const showBpHistoryButton = bps.length > HOME_PAGE_SHOW_LIMIT
  const showBsHistoryButton = bss.length > HOME_PAGE_SHOW_LIMIT

  return (
    <SafeAreaView
      style={[containerStyles.fill, {backgroundColor: colors.white}]}>
      <StatusBar backgroundColor="blue" barStyle="light-content" />
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
            {hasMedicines && (
              <>
                <View style={[styles.homeContainer]}>
                  <BodyHeader style={[styles.sectionHeader]}>
                    <FormattedMessage id="home.my-medicines" />
                  </BodyHeader>
                  <BodyText
                    style={[
                      {
                        marginTop: 8,
                        fontSize: 18,
                        color: colors.grey1,
                      },
                    ]}>
                    <FormattedMessage id={'home.no-medicines'} />
                  </BodyText>
                  {meds.map((medicine, index) => (
                    <View
                      key={index}
                      style={[
                        {
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: index === 0 ? 8 : 0,
                        },
                      ]}>
                      <Image
                        source={medicinePill}
                        style={[styles.informationIcon]}
                      />
                      <BodyText
                        style={{
                          fontSize: 18,
                          color: colors.grey0,
                          fontWeight: '500',
                        }}>
                        {medicationDisplayName(medicine)}
                      </BodyText>
                    </View>
                  ))}
                </View>
                <View style={[styles.homeContainer, {flexDirection: 'row'}]}>
                  <Image
                    source={medicineClock}
                    style={[styles.informationIcon]}
                  />
                  <View style={[{flexShrink: 1}]}>
                    <BodyText style={[styles.sectionText]}>
                      <FormattedMessage id={'home.take-medicines'} />
                    </BodyText>
                    <BodyText
                      style={[
                        {
                          fontSize: 18,
                          color: colors.grey1,
                        },
                      ]}>
                      <FormattedMessage id={'home.take-as-directed'} />
                    </BodyText>
                  </View>
                </View>
              </>
            )}
            <View style={[styles.homeContainer]}>
              <BodyHeader style={[styles.sectionHeader]}>
                <FormattedMessage id="home.my-bp" />
              </BodyHeader>
              {bps.length > 0 ? (
                <>
                  {bps.map((bp, index) => {
                    if (index > HOME_PAGE_SHOW_LIMIT - 1) {
                      return null
                    }

                    return <BpInformation bp={bp} key={index} />
                  })}
                </>
              ) : (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Image
                    style={{
                      marginTop: 32,
                      marginBottom: 4,
                    }}
                    source={greyHeart}
                  />
                  <BodyText
                    style={[
                      styles.sectionText,
                      {
                        color: colors.grey1,
                        marginBottom: 70,
                        textAlign: 'center',
                      },
                    ]}>
                    <FormattedMessage id={'home.you-have-no-bp'} />
                  </BodyText>
                </View>
              )}
              <View style={{marginTop: 15, flexDirection: 'row'}}>
                <Button
                  style={[
                    styles.bpButton,
                    {
                      marginRight: showBpHistoryButton ? 12 : 0,
                    },
                  ]}
                  buttonColor={colors.blue2}
                  title={intl.formatMessage({id: 'home.add-bp'})}
                  onPress={() => {
                    navigation.navigate(SCREENS.ADD_BP)
                  }}
                />
                {showBpHistoryButton && (
                  <Button
                    style={[
                      styles.bpButton,
                      {
                        marginLeft: 12,
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
            <View style={[styles.homeContainer]}>
              <BodyHeader style={[styles.sectionHeader]}>
                <FormattedMessage id="home.my-blood-sugar" />
              </BodyHeader>
              {bss.length > 0 ? (
                <>
                  {bss.map((bs, index) => {
                    if (index > HOME_PAGE_SHOW_LIMIT - 1) {
                      return null
                    }

                    return <BsInformation bs={bs} key={index} />
                  })}
                </>
              ) : (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Image
                    style={{
                      marginTop: 32,
                      marginBottom: 4,
                    }}
                    source={grayDrop}
                  />
                  <BodyText
                    style={[
                      styles.sectionText,
                      {
                        color: colors.grey1,
                        marginBottom: 70,
                        textAlign: 'center',
                      },
                    ]}>
                    <FormattedMessage id={'home.you-have-no-bs'} />
                  </BodyText>
                </View>
              )}
              <View style={{marginTop: 15, flexDirection: 'row'}}>
                <Button
                  style={[
                    styles.bpButton,
                    {
                      marginRight: showBsHistoryButton ? 12 : 0,
                    },
                  ]}
                  buttonColor={colors.blue2}
                  title={intl.formatMessage({id: 'home.add-bs'})}
                  onPress={() => {
                    navigation.navigate(SCREENS.ADD_BS)
                  }}
                />
                {showBsHistoryButton && (
                  <Button
                    style={[
                      styles.bpButton,
                      {
                        marginLeft: 12,
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
          <View style={styles.buttonContainer}>
            <Button
              style={{
                backgroundColor: colors.green1,
              }}
              title={intl.formatMessage({id: 'general.contact-a-doctor'})}
              onPress={() => {}}
            />
          </View>
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
  homeContainer: {
    backgroundColor: colors.white100,
    borderRadius: 4,
    marginHorizontal: 8,
    marginBottom: 8,
    flexShrink: 0,
    padding: 24,

    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
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
    shadowColor: 'rgba(0, 117, 235, 0.3)',
    flex: 1,
  },
})
