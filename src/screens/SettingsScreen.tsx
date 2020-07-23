import React from 'react'
import {
  SafeAreaView,
  View,
  StatusBar,
  StyleSheet,
  Linking,
  ScrollView,
  Platform,
} from 'react-native'
import {FormattedMessage, useIntl} from 'react-intl'
import {Item} from 'react-native-picker-select'

import {containerStyles, colors} from '../styles'
import {BodyText, BodyHeader, Picker, Button, ButtonType} from '../components'
import {
  AVAILABLE_TRANSLATIONS,
  languageCodeToDisplayTitle,
} from '../constants/languages'
import {
  patientSelector,
  localeSelector,
  bloodSugarUnitSelector,
  hasReviewedSelector,
} from '../redux/patient/patient.selectors'
import {
  setLanguage,
  setBloodSugarUnit,
  setHasReviewed,
} from '../redux/patient/patient.actions'
import SCREENS from '../constants/screens'

import {PassportLinkedState} from '../redux/auth/auth.models'
import {passportLinkedStateSelector} from '../redux/auth/auth.selectors'
import {useThunkDispatch} from '../redux/store'
import {
  AVAILABLE_BLOOD_SUGAR_UNITS,
  bloodSugarUnitToDisplayTitle,
} from '../utils/blood-sugars'
import * as RNLocalize from 'react-native-localize'
import {DEFAULT_LANGUAGE_CODE} from '../constants/languages'

const LanguagePicker = () => {
  const localeStored = localeSelector()
  const locale =
    localeStored ??
    (RNLocalize.findBestAvailableLanguage(AVAILABLE_TRANSLATIONS)
      ?.languageTag ||
      DEFAULT_LANGUAGE_CODE)
  const dispatch = useThunkDispatch()

  const locales: Item[] = []

  AVAILABLE_TRANSLATIONS.forEach((languageCode) => {
    locales.push({
      label: languageCodeToDisplayTitle(languageCode),
      value: languageCode,
    })
  })

  return (
    <>
      <View style={[styles.header, {paddingTop: 24}]}>
        <BodyHeader>
          <FormattedMessage id="settings.language" />
        </BodyHeader>
      </View>
      <View>
        <Picker
          onValueChange={(language: string) => {
            dispatch(setLanguage(language))
          }}
          items={locales}
          value={locale}
        />
      </View>
    </>
  )
}

type BloodSugarUnitPickerProps = {apiUser: any}

const BloodSugarUnitPicker = ({apiUser}: BloodSugarUnitPickerProps) => {
  const selectedBloodSugarUnit = bloodSugarUnitSelector()
  const dispatch = useThunkDispatch()

  const bloodSugarUnits: Item[] = []
  AVAILABLE_BLOOD_SUGAR_UNITS.forEach((bloodSugarUnit) => {
    bloodSugarUnits.push({
      label: bloodSugarUnitToDisplayTitle(bloodSugarUnit),
      value: bloodSugarUnit,
    })
  })

  return (
    <>
      <View style={[styles.header, apiUser ? {} : {paddingTop: 24}]}>
        <BodyHeader>
          <FormattedMessage id="settings.bs-units" />
        </BodyHeader>
      </View>
      <View>
        <Picker
          onValueChange={(bloodSugarUnit: string) => {
            dispatch(setBloodSugarUnit(bloodSugarUnit))
          }}
          items={bloodSugarUnits}
          value={selectedBloodSugarUnit}
        />
      </View>
    </>
  )
}

const ConnectSection = ({intl, navigation}: any) => {
  return (
    <>
      <View style={styles.header}>
        <BodyHeader>
          <FormattedMessage id="settings.connect" />
        </BodyHeader>
      </View>
      <View style={styles.item}>
        <BodyText>
          <FormattedMessage id="settings.have-a-passport" />
        </BodyText>
      </View>
      <View>
        <Button
          style={[styles.bpButton, {}]}
          buttonType={ButtonType.LightBlue}
          title={intl.formatMessage({id: 'login.scan-passport'})}
          onPress={() => {
            navigation.navigate(SCREENS.SCAN_STACK)
          }}
        />
      </View>
    </>
  )
}

const LegalSection = () => {
  return (
    <>
      <BodyHeader style={styles.header}>
        <FormattedMessage id="general.legal" />
      </BodyHeader>
      <BodyText
        style={[styles.item, styles.linkText]}
        onPress={() => {
          Linking.openURL('https://www.simple.org/patient-privacy')
        }}>
        <FormattedMessage id="settings.privacy-policy-link" />
      </BodyText>

      <BodyText style={styles.subHeader}>
        <FormattedMessage id="general.disclaimer" />
      </BodyText>
      <BodyText style={styles.item}>
        <FormattedMessage id="consent.medical-disclaimer" />
      </BodyText>
    </>
  )
}

const UserDetails = ({apiUser}: any) => {
  return (
    <>
      <View style={[styles.header, apiUser ? {paddingTop: 24} : {}]}>
        <BodyHeader>
          <FormattedMessage id="settings.profile" />
        </BodyHeader>
      </View>
      <View style={styles.item}>
        <BodyHeader style={styles.itemText}>{apiUser?.full_name}</BodyHeader>
        <BodyText style={styles.itemLabel}>
          <FormattedMessage id="settings.name" />
        </BodyText>
      </View>
      <View style={styles.item}>
        <BodyHeader style={styles.itemText}>
          {apiUser?.address?.state}
        </BodyHeader>
        <BodyText style={styles.itemLabel}>
          <FormattedMessage id="settings.state" />
        </BodyText>
      </View>
    </>
  )
}

const SupportSection = () => {
  const dispatch = useThunkDispatch()

  return (
    <>
      <BodyHeader style={styles.header}>
        <FormattedMessage id="general.support" />
      </BodyHeader>

      <BodyText
        style={[styles.item, styles.linkText]}
        onPress={() => {
          Linking.openURL('https://www.simple.org/contact/')
        }}>
        <FormattedMessage id="settings.contact" />
      </BodyText>

      <BodyText
        style={[styles.item, styles.linkText]}
        onPress={() => {
          Linking.openURL('https://www.simple.org/bp-passport/')
        }}>
        <FormattedMessage id="settings.about" />
      </BodyText>

      <BodyText
        style={[styles.lastItem, styles.linkText]}
        onPress={() => {
          dispatch(setHasReviewed(true))
          Platform.OS === 'ios'
            ? Linking.openURL(
                'itms-apps://apps.apple.com/us/app/bp-passport/id1510811893?action=write-review',
              )
            : Linking.openURL('market://details?id=org.simple.bppassport')
        }}>
        <FormattedMessage id="general.write-a-review" />
      </BodyText>
    </>
  )
}

function SettingsScreen({navigation}: any) {
  const apiUser = patientSelector()

  const intl = useIntl()

  const passportLinkedState = passportLinkedStateSelector()
  const hasPassportLinked =
    passportLinkedState === PassportLinkedState.Linking ||
    passportLinkedState === PassportLinkedState.Linked

  return (
    <SafeAreaView
      style={[containerStyles.fill, {backgroundColor: colors.white}]}>
      <StatusBar barStyle="light-content" />
      <View style={[containerStyles.fill]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {apiUser && <UserDetails apiUser={apiUser} />}

            <BloodSugarUnitPicker apiUser={apiUser} />
            <LanguagePicker />

            {!hasPassportLinked && (
              <ConnectSection intl={intl} navigation={navigation} />
            )}
            <SupportSection />
            <LegalSection />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default SettingsScreen

const styles = StyleSheet.create({
  content: {marginHorizontal: 24, marginBottom: 24},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    marginBottom: 12,
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 22,
    lineHeight: 28,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    marginBottom: 8,
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 28,
  },
  item: {flexDirection: 'column', marginBottom: 16},
  lastItem: {marginBottom: 0},
  itemText: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: 0.2,
  },
  itemLabel: {
    fontFamily: 'Roboto',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.2,
    color: colors.grey1,
  },
  linkText: {
    fontFamily: 'Roboto',
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: 0.2,
    color: colors.blue2,
    fontStyle: 'normal',
    fontWeight: '500',
  },
  bpButton: {
    flex: 1,
  },
})
