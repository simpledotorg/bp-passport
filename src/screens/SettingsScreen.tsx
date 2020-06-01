import React, {useEffect} from 'react'
import {
  SafeAreaView,
  View,
  StatusBar,
  StyleSheet,
  Linking,
  ScrollView,
} from 'react-native'
import {FormattedMessage, useIntl} from 'react-intl'
import {Item} from 'react-native-picker-select'

import {containerStyles, colors} from '../styles'
import {BodyText, BodyHeader, Picker, Button, ButtonType} from '../components'
import {
  AVAILABLE_TRANSLATIONS,
  languageCodeToDisplayTitle,
} from '../constants/languages'
import {useLocale} from '../effects/use-locale-messages.effect'
import {patientSelector} from '../redux/patient/patient.selectors'
import {setLanguage} from '../redux/patient/patient.actions'
import SCREENS from '../constants/screens'

import {PassportLinkedState} from '../redux/auth/auth.models'
import {passportLinkedStateSelector} from '../redux/auth/auth.selectors'
import {localeSelector} from '../redux/patient/patient.selectors'
import {useThunkDispatch} from '../redux/store'

function SettingsScreen({navigation}: any) {
  const apiUser = patientSelector()

  const intl = useIntl()
  const dispatch = useThunkDispatch()

  const locale = localeSelector()
  const passportLinkedState = passportLinkedStateSelector()
  const hasPassportLinked =
    passportLinkedState === PassportLinkedState.Linking ||
    passportLinkedState === PassportLinkedState.Linked

  useEffect(() => {}, [passportLinkedState, apiUser])

  const locales: Item[] = []

  AVAILABLE_TRANSLATIONS.forEach((languageCode) => {
    locales.push({
      label: languageCodeToDisplayTitle(languageCode),
      value: languageCode,
    })
  })

  return (
    <SafeAreaView
      style={[containerStyles.fill, {backgroundColor: colors.white}]}>
      <StatusBar barStyle="light-content" />
      <View style={[containerStyles.fill]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {apiUser && (
              <>
                <View style={[styles.header, apiUser ? {paddingTop: 24} : {}]}>
                  <BodyHeader>
                    <FormattedMessage id="settings.profile" />
                  </BodyHeader>
                </View>
                <View style={styles.item}>
                  <BodyHeader style={styles.itemText}>
                    {apiUser?.full_name}
                  </BodyHeader>
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
            )}

            <View style={[styles.header, apiUser ? {} : {paddingTop: 24}]}>
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

            <View style={styles.header}>
              <BodyHeader>
                <FormattedMessage id="settings.about" />
              </BodyHeader>
            </View>
            <View style={styles.item}>
              <BodyText
                style={styles.linkText}
                onPress={() => {
                  Linking.openURL('https://www.simple.org/patient-privacy')
                }}>
                <FormattedMessage id="settings.privacy-policy-link" />
              </BodyText>
            </View>
            <View style={styles.item}>
              <BodyText
                style={styles.linkText}
                onPress={() => {
                  Linking.openURL('https://www.simple.org/contact/')
                }}>
                <FormattedMessage id="settings.contact" />
              </BodyText>
            </View>
            <View style={styles.lastItem}>
              <BodyText
                style={styles.linkText}
                onPress={() => {
                  Linking.openURL('https://www.simple.org/bp-passport/')
                }}>
                <FormattedMessage id="settings.about" />
              </BodyText>
            </View>
            {!hasPassportLinked && (
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
            )}
            <View style={styles.header}>
              <BodyHeader>
                <FormattedMessage id="general.disclaimer" />
              </BodyHeader>
            </View>
            <View style={styles.item}>
              <BodyText>
                <FormattedMessage id="consent.medical-disclaimer" />
              </BodyText>
            </View>
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
