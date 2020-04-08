import React from 'react'
import {SafeAreaView, View, Image} from 'react-native'
import {FormattedMessage} from 'react-intl'

import SCREENS from '../constants/screens'
import {containerStyles, colors, bpPassportImage} from '../styles'
import {Button, Link, PageHeader} from '../components'

function Login({navigation}: any) {
  return (
    <SafeAreaView
      style={[containerStyles.fill, {backgroundColor: colors.white}]}>
      <View
        style={[
          containerStyles.fill,
          containerStyles.centeredContent,
          containerStyles.pageContainer,
        ]}>
        <Image source={bpPassportImage} />
        <View
          style={[
            {
              width: '80%',
            },
          ]}>
          <PageHeader style={{textAlign: 'center'}}>
            <FormattedMessage id="login.title" />
          </PageHeader>
        </View>
      </View>
      <View
        style={[
          {
            margin: 16,
          },
        ]}>
        <Button
          title={<FormattedMessage id="login.primary-button" />}
          onPress={() => {
            navigation.navigate(SCREENS.HOME)
          }}
        />
        <View
          style={[
            {
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16,
            },
          ]}>
          <Link>
            <FormattedMessage id="login.no-bp-passport" />
          </Link>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Login
