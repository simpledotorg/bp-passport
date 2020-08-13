import React, {useEffect} from 'react'
import {View, Text, Image, StyleSheet, StyleProp, ViewStyle} from 'react-native'
import {containerStyles, navigation, colors, iconHomeHeader} from '../styles'
import {FormattedMessage} from 'react-intl'
import {PassportLinkedState} from '../redux/auth/auth.models'
import {passportLinkedStateSelector} from '../redux/auth/auth.selectors'
import {useNavigation} from '@react-navigation/native'

import {patientSelector} from '../redux/patient/patient.selectors'
import {passportSelector} from '../redux/auth/auth.selectors'
import {ButtonIcon} from './button'
import SCREENS from '../constants/screens'

export const HomeHeader = () => {
  const passportLinkedState = passportLinkedStateSelector()
  const navigation = useNavigation()
  return (
    <View
      style={{
        flex: 1,
        height: 103,
        backgroundColor: colors.blue1,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View style={{width: 50}} />
      <HomeHeaderTitle />
      <View style={{width: 50}}>
        {passportLinkedState !== PassportLinkedState.Linking && (
          <ButtonIcon
            iconName="settings"
            iconColor={colors.grey3}
            onPress={() => {
              navigation.navigate(SCREENS.SETTINGS)
            }}
            style={{marginRight: 8}}
          />
        )}
      </View>
    </View>
  )
}

export const HomeHeaderTitle = () => {
  const passportLinkedState = passportLinkedStateSelector()
  const apiUser = patientSelector()
  const passport = passportSelector()

  const showLoading = passportLinkedState === PassportLinkedState.Linking

  const hasFullName = apiUser?.full_name ? true : false
  const hasPassportShortcode = passport?.shortcode ? true : false

  useEffect(() => {}, [apiUser, passportLinkedState])

  if (showLoading) {
    return (
      <View style={[containerStyles.fill, containerStyles.centeredContent]}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingTitle} />
          <View />
          <View style={styles.loadingSubtitle} />
        </View>
      </View>
    )
  }

  if (!apiUser) {
    return (
      <View
        style={[
          containerStyles.fill,
          containerStyles.centeredContent,
          {flexDirection: 'row'},
        ]}>
        <Image source={iconHomeHeader} />
        <Text
          style={{
            ...navigation.homeHeaderTitleStyle,
            marginHorizontal: 11,
          }}
          numberOfLines={1}>
          BP Passport
        </Text>
      </View>
    )
  }

  return (
    <View style={[containerStyles.fill, containerStyles.centeredContent]}>
      {hasFullName && (
        <Text
          style={{
            ...navigation.homeHeaderTitleStyle,
          }}
          numberOfLines={1}>
          {apiUser?.full_name}
        </Text>
      )}
      {hasPassportShortcode && (
        <Text style={{...navigation.homeSubHeaderTitleStyle}} numberOfLines={1}>
          BP Passport {passport?.shortcode}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    height: 43,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loadingTitle: {
    backgroundColor: colors.white,
    height: 18,
    width: 182,
    borderRadius: 12,
  },
  loadingSubtitle: {
    backgroundColor: colors.white48,
    height: 12,
    width: 162,
    borderRadius: 12,
  },
})
