import React, { useRef, useEffect } from 'react'
import {
  Dimensions,
  View,
  StatusBar,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StackNavigationProp } from '@react-navigation/stack'

import { containerStyles, colors } from '../styles'
import SCREENS from '../constants/screens'
import { RootStackParamList } from '../navigation/Navigation'
import {
  ContentLoadingSegmentSize,
  HomeHeader,
  Placeholder,
  HealthReminderFlatlist,
} from '../components'
import useSetNotificationsSchedule from '../hooks/useSetNotificationsSchedule'
import * as Notifications from 'expo-notifications'

import { PassportLinkedState } from '../redux/auth/auth.models'
import { AppDispatch, RootState, useThunkDispatch } from '../redux/store'
import { getPatient } from '../redux/patient/patient.actions'

import { PassportLinkedStateSelector } from '../redux/auth/auth.selectors'
import {
  PatientSelector,
  BloodSugarUnitSelector,
} from '../redux/patient/patient.selectors'
import { BloodPressuresSelector } from '../redux/blood-pressure/blood-pressure.selectors'
import { BloodPressure } from '../redux/blood-pressure/blood-pressure.models'
import { BloodSugarsSelector } from '../redux/blood-sugar/blood-sugar.selectors'
import { BloodSugar } from '../redux/blood-sugar/blood-sugar.models'
import { MedicationsSelector } from '../redux/medication/medication.selectors'
import { Medication } from '../redux/medication/medication.models'
import BloodPressureSection from '../components/home-page/blood-pressure-section'
import BloodSugarSection from '../components/home-page/blood-sugar-section'
import MedicalDetailsSection from '../components/home-page/medicine-section'
import ConvertedBloodSugarReading from '../models/converted_blood_sugar_reading'
import { useSelector } from 'react-redux'
import { firstLoadSlice } from '../redux/slices/firstLoadSlice'

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.HOME
>
type Props = {
  navigation: HomeScreenNavigationProp
}

const HOME_PAGE_SHOW_LIMIT = 3

function Home({ navigation }: Props) {
  const dispatch = useThunkDispatch()

  // Custom dispatch type for getPatient() thunk
  const appDispatch: AppDispatch = useThunkDispatch()

  const { firstLoad } = useSelector((state: RootState) => state.firstLoad)
  const { setFirstLoad } = firstLoadSlice.actions

  const opacityNavAnim = useRef(new Animated.Value(1)).current

  const apiUser = PatientSelector()
  const passportLinkedState = PassportLinkedStateSelector()

  const bloodPressures = BloodPressuresSelector()

  const bloodSugars = BloodSugarsSelector()
  const bloodSugarDisplayUnits = BloodSugarUnitSelector()

  const medications = MedicationsSelector()

  const setNotificationsSchedule = useSetNotificationsSchedule()

  useEffect(() => {
    if (firstLoad) {
      Notifications.cancelAllScheduledNotificationsAsync().then(() => {
        if (medications) {
          medications.forEach((medication: Medication) => {
            setNotificationsSchedule(medication.reminder, medication.name)
          })
        }
        dispatch(setFirstLoad(false))
      })
    }
  }, [medications, firstLoad, setNotificationsSchedule, dispatch, setFirstLoad])

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
      appDispatch(getPatient())
    }
  }, [])

  const bps: BloodPressure[] =
    bloodPressures?.slice(0, HOME_PAGE_SHOW_LIMIT) ?? []
  const bss: BloodSugar[] = bloodSugars?.slice(0, HOME_PAGE_SHOW_LIMIT) ?? []
  const convertedBloodSugarReadings = bss.map(
    (reading) =>
      new ConvertedBloodSugarReading(reading, bloodSugarDisplayUnits),
  )

  const meds: Medication[] = medications ?? []

  return (
    <SafeAreaView
      style={[containerStyles.fill, { backgroundColor: colors.grey4 }]}
    >
      <StatusBar backgroundColor={colors.blue1} barStyle="light-content" />
      <View
        style={{
          position: 'absolute',
          backgroundColor: colors.blue1,
          top: 0,
          left: 0,
          right: 0,
          height: 60,
        }}
      />
      <View style={{ flex: 1 }}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          <View style={{ backgroundColor: colors.blue1 }}>
            <Animated.View style={{ opacity: opacityNavAnim }}>
              <HomeHeader />
            </Animated.View>
          </View>
          <View style={{ backgroundColor: colors.blue1, height: 30 }} />
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
          <View style={[containerStyles.fill, { marginTop: 103 }]}>
            <Placeholder size={ContentLoadingSegmentSize.Small} />
            <Placeholder size={ContentLoadingSegmentSize.Large} />
            <Placeholder size={ContentLoadingSegmentSize.Small} />
          </View>
        )}
        {!showLoading && (
          <ScrollView
            style={styles.scrollContainer}
            scrollEventThrottle={100}
            onScroll={(event) => {
              const scrollY: number = event.nativeEvent.contentOffset.y

              if (scrollY > 150) {
                opacityNavAnim.setValue(0)
              } else {
                opacityNavAnim.setValue(1)
              }
            }}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
          >
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
            <View
              style={[containerStyles.carouselSegment, { overflow: 'hidden' }]}
            >
              <HealthReminderFlatlist />
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
    flexDirection: 'row',
    alignItems: 'center',
  },
})
