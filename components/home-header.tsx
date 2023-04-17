import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import {
  containerStyles,
  navigation as nav,
  colors,
  iconHomeHeader,
} from '../styles'
import { RootStackParamList } from '../navigation/Navigation'
import { PassportLinkedState } from '../redux/auth/auth.models'
import { PassportLinkedStateSelector } from '../redux/auth/auth.selectors'

import { PatientSelector } from '../redux/patient/patient.selectors'
import { PassportSelector } from '../redux/auth/auth.selectors'
import { ButtonIcon } from './button'
import SCREENS from '../constants/screens'

export const HomeHeader = () => {
  const passportLinkedState = PassportLinkedStateSelector()
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

  return (
    <View
      style={{
        flex: 1,
        height: 103,
        backgroundColor: colors.blue1,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <View style={{ width: 50 }} />
      <HomeHeaderTitle />
      <View style={{ width: 50 }}>
        {passportLinkedState !== PassportLinkedState.Linking && (
          <ButtonIcon
            iconName="settings"
            iconColor={colors.grey3}
            onPress={() => {
              navigation.navigate(SCREENS.SETTINGS)
            }}
            style={{ marginRight: 8 }}
          />
        )}
      </View>
    </View>
  )
}

export const HomeHeaderTitle = () => {
  const passportLinkedState = PassportLinkedStateSelector()
  const apiUser = PatientSelector()
  const passport = PassportSelector()

  const showLoading = passportLinkedState === PassportLinkedState.Linking

  const hasFullName = apiUser?.full_name ? true : false
  const hasPassportShortcode = passport?.shortcode ? true : false

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
          { flexDirection: 'row' },
        ]}
      >
        <Image source={iconHomeHeader} />
        <Text
          style={{
            ...nav.homeHeaderTitleStyle,
            marginHorizontal: 11,
          }}
          numberOfLines={1}
        >
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
            ...nav.homeHeaderTitleStyle,
          }}
          numberOfLines={1}
        >
          {apiUser?.full_name}
        </Text>
      )}
      {hasPassportShortcode && (
        <Text style={{ ...nav.homeSubHeaderTitleStyle }} numberOfLines={1}>
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
