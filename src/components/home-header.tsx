import React, {useContext, useEffect} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {containerStyles, navigation, colors} from '../styles'
import {FormattedMessage} from 'react-intl'
import {LoginState} from '../redux/auth/auth.models'
import {loginStateSelector} from '../redux/auth/auth.selectors'

import {patientSelector} from '../redux/patient/patient.selectors'
import {authParamsSelector} from '../redux/auth/auth.selectors'

export const HomeHeaderTitle = () => {
  const loginState = loginStateSelector()
  const apiUser = patientSelector()
  const authParams = authParamsSelector()

  const showLoading = loginState === LoginState.LoggingIn

  const hasFullName = apiUser?.full_name ? true : false
  const hasPassportShortcode = authParams?.passport?.shortcode ? true : false

  useEffect(() => {}, [apiUser, loginState])

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
