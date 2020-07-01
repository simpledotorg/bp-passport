import React, {useRef, useState, useEffect} from 'react'
import {
  Dimensions,
  SafeAreaView,
  View,
  StatusBar,
  ScrollView,
  StyleSheet,
  AppState,
  Platform,
  Animated,
} from 'react-native'
import {useIntl} from 'react-intl'
import {StackNavigationProp} from '@react-navigation/stack'

import {containerStyles, colors} from '../styles'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'
import {
  ContentLoadingSegment,
  ContentLoadingSegmentSize,
  HomeHeader,
  HealthReminders,
} from '../components'

import {PassportLinkedState} from '../redux/auth/auth.models'
import {useThunkDispatch} from '../redux/store'
import {getPatient} from '../redux/patient/patient.actions'

import {passportLinkedStateSelector} from '../redux/auth/auth.selectors'
import {
  patientSelector,
  bloodSugarUnitSelector,
} from '../redux/patient/patient.selectors'
import {bloodPressuresSelector} from '../redux/blood-pressure/blood-pressure.selectors'
import {BloodPressure} from '../redux/blood-pressure/blood-pressure.models'
import {bloodSugarsSelector} from '../redux/blood-sugar/blood-sugar.selectors'
import {BloodSugar} from '../redux/blood-sugar/blood-sugar.models'
import {medicationsSelector} from '../redux/medication/medication.selectors'
import {Medication} from '../redux/medication/medication.models'
import {refreshAllLocalPushReminders} from '../redux/medication/medication.actions'
import BloodPressureSection from '../components/home-page/blood-pressure-section'
import BloodSugarSection from '../components/home-page/blood-sugar-section'
import MedicalDetailsSection from '../components/home-page/medicine-section'
import ConvertedBloodSugarReading from '../models/converted_blood_sugar_reading'

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

  const opacityNavAnim = useRef(new Animated.Value(1)).current

  const apiUser = patientSelector()
  const passportLinkedState = passportLinkedStateSelector()

  const bloodPressures = bloodPressuresSelector()

  const bloodSugars = bloodSugarsSelector()
  const bloodSugarDisplayUnits = bloodSugarUnitSelector()

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

  const [appState, setAppState] = useState(AppState.currentState)

  useEffect(() => {
    const unsubscribe = AppState.addEventListener('change', (nextAppState) => {
      setAppState(nextAppState)
    })

    return unsubscribe
  }, [])

  const bps: BloodPressure[] =
    bloodPressures?.slice(0, HOME_PAGE_SHOW_LIMIT) ?? []
  const bss: BloodSugar[] = bloodSugars?.slice(0, HOME_PAGE_SHOW_LIMIT) ?? []
  const convertedBloodSugarReadings = bss.map(
    (reading) =>
      new ConvertedBloodSugarReading(reading, bloodSugarDisplayUnits),
  )
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
      <View
        style={{
          position: 'absolute',
          backgroundColor: colors.blue1,
          top: 0,
          left: 0,
          right: 0,
          height: 50,
        }}
      />
      <View style={{flex: 1}}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}>
          <View style={{backgroundColor: colors.blue1}}>
            <Animated.View style={{opacity: opacityNavAnim}}>
              <HomeHeader />
            </Animated.View>
          </View>
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
          <View style={[containerStyles.fill, {marginTop: 103}]}>
            <ContentLoadingSegment size={ContentLoadingSegmentSize.Small} />
            <ContentLoadingSegment size={ContentLoadingSegmentSize.Large} />
            <ContentLoadingSegment size={ContentLoadingSegmentSize.Small} />
          </View>
        )}
        {!showLoading && (
          <ScrollView
            style={styles.scrollContainer}
            scrollEventThrottle={100}
            onScroll={(event: any) => {
              const scrollY: number = event.nativeEvent.contentOffset.y

              if (scrollY > 150) {
                opacityNavAnim.setValue(0)
              } else {
                opacityNavAnim.setValue(1)
              }
            }}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}>
            <BloodPressureSection
              bps={bps}
              navigation={navigation}
              showList={HOME_PAGE_SHOW_LIMIT}
            />
            <BloodSugarSection
              bloodSugarReadings={convertedBloodSugarReadings}
              displayUnits={bloodSugarDisplayUnits}
              navigation={navigation}
              showList={HOME_PAGE_SHOW_LIMIT}
            />
            <MedicalDetailsSection meds={meds} navigation={navigation} />
            <View style={[containerStyles.containerSegment]}>
              <HealthReminders />
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  scrollContainer: {
    marginTop: 103,
    overflow: 'visible',
  },
  scrollContentContainer: {
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
