import React, {useContext, useState} from 'react'
import {
  SafeAreaView,
  View,
  StatusBar,
  Text,
  StyleSheet,
  Picker,
} from 'react-native'
import {FormattedMessage, useIntl} from 'react-intl'

import {containerStyles, colors} from '../styles'
import SCREENS from '../constants/screens'
import {BodyText, BodyHeader} from '../components'
import {UserContext} from '../providers/user.provider'
import {getLocales} from 'react-native-localize'

function SettingsScreen({navigation}: any) {
  const {user} = useContext(UserContext)
  const intl = useIntl()
  const locales = getLocales()

  const [selectedLanguage, setSelectedLanguage] = useState(
    locales[0].languageTag,
  )

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
            <BodyHeader>{user?.full_name}</BodyHeader>
            <BodyText style={styles.itemLabel}>
              <FormattedMessage id="settings.name" />
            </BodyText>
          </View>
          <View style={styles.item}>
            <BodyHeader>Gujarat</BodyHeader>
            <BodyText style={styles.itemLabel}>
              <FormattedMessage id="settings.state" />
            </BodyText>
          </View>
          <View style={[styles.header, {marginTop: 24}]}>
            <BodyText style={styles.headerText}>
              <FormattedMessage id="settings.language" />
            </BodyText>
          </View>
          <View style={styles.picker}>
            <Picker
              selectedValue={selectedLanguage}
              onValueChange={(language) => setSelectedLanguage(language)}>
              {locales.map((locale, i) => {
                return (
                  <Picker.Item
                    key={i}
                    label={intl.formatMessage({
                      id: `translation.${locale.languageCode}`,
                    })}
                    value={locale.languageTag}
                  />
                )
              })}
            </Picker>
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
    fontWeight: 'bold',
  },
  item: {flexDirection: 'column', marginBottom: 16},
  itemLabel: {fontSize: 14, color: colors.grey1},
  picker: {borderWidth: 1, borderRadius: 4, borderColor: colors.grey3},
})
