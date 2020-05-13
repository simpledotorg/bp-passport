import React, {useEffect} from 'react'
import {View, Text, Image, StyleSheet} from 'react-native'
import {containerStyles, navigation, colors, iconHomeHeader} from '../styles'
import {FormattedMessage} from 'react-intl'
import {PassportLinkedState} from '../redux/auth/auth.models'
import {passportLinkedStateSelector} from '../redux/auth/auth.selectors'

import {patientSelector} from '../redux/patient/patient.selectors'
import {authParamsSelector} from '../redux/auth/auth.selectors'

export const HomeHeaderTitle = () => {
  const passportLinkedState = passportLinkedStateSelector()
  const apiUser = patientSelector()
  const authParams = authParamsSelector()

  const showLoading = passportLinkedState === PassportLinkedState.Linking

  const hasFullName = apiUser?.full_name ? true : false
  const hasPassportShortcode = authParams?.passport?.shortcode ? true : false

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
          <FormattedMessage id="general.bp-passport" />
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
            marginHorizontal: 43,
          }}
          numberOfLines={1}>
          {apiUser?.full_name}
        </Text>
      )}
      {hasPassportShortcode && (
        <Text style={{...navigation.homeSubHeaderTitleStyle}} numberOfLines={1}>
          <FormattedMessage id="general.bp-passport" />{' '}
          {authParams?.passport?.shortcode}
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
