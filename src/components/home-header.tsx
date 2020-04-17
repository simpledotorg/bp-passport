import React, {useContext} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {containerStyles, navigation, colors} from '../styles'
import {UserContext} from '../providers/user.provider'
import {AuthContext, LoginState} from '../providers/auth.provider'
import {FormattedMessage} from 'react-intl'

export const HomeHeaderTitle = () => {
  const {loginState} = useContext(AuthContext)
  switch (loginState) {
    case LoginState.LoggingIn:
      // show animation state
      break
    case LoginState.LoggedIn:
      // show user profile
      break
    case LoginState.LoggedOut:
      // n /a
      break
  }

  const showLoading = loginState === LoginState.LoggingIn
  const {user} = useContext(UserContext)

  const hasFullName = user?.full_name ? true : false
  const hasPasswordDigest = user?.password_digest ? true : false

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
          {user?.full_name}
        </Text>
      )}
      {hasPasswordDigest && (
        <Text style={{...navigation.homeSubHeaderTitleStyle}} numberOfLines={1}>
          <FormattedMessage id="general.bp-passport" /> {user?.password_digest}
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
