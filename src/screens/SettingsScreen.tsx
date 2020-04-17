import React, {useContext, useState} from 'react'
import {
  SafeAreaView,
  View,
  StatusBar,
  StyleSheet,
  Linking,
  Platform,
} from 'react-native'
import {FormattedMessage, useIntl} from 'react-intl'
import Picker, {Item} from 'react-native-picker-select'
import Icon from 'react-native-vector-icons/MaterialIcons'

import {containerStyles, colors} from '../styles'
import {BodyText, BodyHeader} from '../components'
import {UserContext} from '../providers/user.provider'
import {AVAILABLE_TRANSLATIONS} from '../constants/languages'
import {useLocale} from '../effects/use-locale-messages.effect'

function SettingsScreen({navigation}: any) {
  const {user} = useContext(UserContext)
  const intl = useIntl()
  const {locale, setLocale} = useLocale()

  const locales: Item[] = []

  AVAILABLE_TRANSLATIONS.forEach((language) => {
    locales.push({
      label: intl.formatMessage({
        id: `translation.${language}`,
      }),
      value: language,
    })
  })

  return (
    <SafeAreaView
      style={[containerStyles.fill, {backgroundColor: colors.white}]}>
      <StatusBar backgroundColor="blue" barStyle="light-content" />
      <View style={[containerStyles.fill]}>
        <View style={styles.content}>
          <View style={styles.header}>
            <BodyText style={styles.headerText}>
              <FormattedMessage id="settings.profile" />
            </BodyText>
          </View>

          <View style={styles.item}>
            <BodyHeader style={styles.itemText}>{user?.full_name}</BodyHeader>
            <BodyText style={styles.itemLabel}>
              <FormattedMessage id="settings.name" />
            </BodyText>
          </View>
          <View style={styles.item}>
            <BodyHeader style={styles.itemText}>Gujarat</BodyHeader>
            <BodyText style={styles.itemLabel}>
              <FormattedMessage id="settings.state" />
            </BodyText>
          </View>
          <View style={[styles.header, {marginTop: 24}]}>
            <BodyText style={styles.headerText}>
              <FormattedMessage id="settings.language" />
            </BodyText>
          </View>
          <View style={{marginBottom: 40}}>
            <Picker
              onValueChange={(language: string) => setLocale(language)}
              items={locales}
              value={locale}
              placeholder={{}}
              useNativeAndroidPickerStyle={false}
              style={pickerStyles}
              Icon={() => (
                <Icon name="expand-more" size={24} color={colors.black} />
              )}
            />
          </View>

          <View style={styles.header}>
            <BodyText style={styles.headerText}>
              <FormattedMessage id="settings.about" />
            </BodyText>
          </View>
          <View style={styles.item}>
            <BodyText
              style={styles.linkText}
              onPress={() => {
                Linking.openURL('https://simple.org/patient-privacy')
              }}>
              <FormattedMessage id="settings.privacy-policy-link" />
            </BodyText>
          </View>
          <View style={styles.item}>
            <BodyText
              style={styles.linkText}
              onPress={() => {
                Linking.openURL('https://simple.org/terms ')
              }}>
              <FormattedMessage id="settings.terms-link" />
            </BodyText>
          </View>
          <View style={styles.item}>
            <BodyText
              style={styles.linkText}
              onPress={() => {
                Linking.openURL('https://simple.org/')
              }}>
              <FormattedMessage id="settings.about" />
            </BodyText>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default SettingsScreen

const styles = StyleSheet.create({
  content: {margin: 24},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
  item: {flexDirection: 'column', marginBottom: 16},
  itemText: {
    fontFamily: 'Roboto',
    fontWeight: 'normal',
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
  },
})

const pickerStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.grey3,
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.grey3,
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  iconContainer: {
    top: Platform.OS === 'ios' ? 10 : 15,
    right: 12,
  },
})
