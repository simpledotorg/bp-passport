import React from 'react'
import {SafeAreaView, View, StatusBar, Text, StyleSheet} from 'react-native'
import {FormattedMessage} from 'react-intl'

import {containerStyles, colors} from '../styles'
import SCREENS from '../constants/screens'
import {BodyText} from '../components'

function SettingsScreen({navigation}: any) {
  return (
    <SafeAreaView
      style={[containerStyles.fill, {backgroundColor: colors.white}]}>
      <StatusBar backgroundColor="blue" barStyle="light-content" />
      <View
        style={[
          containerStyles.fill,
          containerStyles.centeredContent,
          {margin: 24},
        ]}>
        <View>
          <BodyText style={styles.itemText}>
            <FormattedMessage id="settings.about" />
          </BodyText>
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
    paddingVertical: 24,
    borderBottomColor: colors.grey3,
    borderBottomWidth: 1,
    marginBottom: 24,
  },
  item: {marginTop: 24, flexDirection: 'row', alignItems: 'center'},
  itemText: {marginLeft: 16, flex: 1},
})
