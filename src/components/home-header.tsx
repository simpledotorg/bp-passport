import React, {useContext} from 'react'
import {View, Text} from 'react-native'
import {containerStyles, navigation} from '../styles'
import {UserContext} from '../providers/user.provider'
import {FormattedMessage} from 'react-intl'

export const HomeHeaderTitle = () => {
  const {user} = useContext(UserContext)

  const hasFullName = user?.full_name ? true : false
  const hasPasswordDigest = user?.password_digest ? true : false

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
