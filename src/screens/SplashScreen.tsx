import React from 'react'
import {SafeAreaView, View, Image, StyleSheet} from 'react-native'
import {FormattedMessage} from 'react-intl'
import Icon from 'react-native-vector-icons/MaterialIcons'

import {containerStyles, colors, iconSplash, bpLogo} from '../styles'
import {Button, BodyHeader, BodyText} from '../components'
import SCREENS from '../constants/screens'

function SplashScreen({navigation}: any) {
  return (
    <SafeAreaView
      style={[containerStyles.fill, {backgroundColor: colors.white}]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image source={iconSplash} style={{marginRight: 14}} />
          <Image
            source={bpLogo}
            style={{height: 20, resizeMode: 'contain', marginTop: 5}}
          />
        </View>

        <BodyHeader>
          <FormattedMessage id="splash.sub-title" />
        </BodyHeader>

        <View>
          <View
            style={{
              marginTop: 24,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Icon name="edit" size={24} color={colors.grey2} />
            <BodyText style={styles.itemText}>
              <FormattedMessage id="splash.track" />
            </BodyText>
          </View>
          <View style={styles.item}>
            <Icon name="record-voice-over" size={24} color={colors.grey2} />
            <BodyText style={styles.itemText}>
              <FormattedMessage id="splash.talk" />
            </BodyText>
          </View>
          <View style={styles.item}>
            <Icon name="local-pharmacy" size={24} color={colors.grey2} />
            <BodyText style={styles.itemText}>
              <FormattedMessage id="splash.medicine" />
            </BodyText>
          </View>
          <View style={styles.item}>
            <Icon name="alarm" size={24} color={colors.grey2} />
            <BodyText style={styles.itemText}>
              <FormattedMessage id="splash.reminders" />
            </BodyText>
          </View>
        </View>
        <Button
          style={{marginTop: 24}}
          title={<FormattedMessage id="general.next" />}
          onPress={() => {
            navigation.navigate(SCREENS.CONSENT)
          }}
        />
      </View>
    </SafeAreaView>
  )
}

export default SplashScreen

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
