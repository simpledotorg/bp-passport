import React from 'react'
import {View, Image} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'

import SCREENS from '../constants/screens'
import {containerStyles, colors} from '../styles'
import {HeaderBar, HeaderBarText, Button, Link, PageHeader} from '../components'

function Login({navigation}: any) {
  return (
    <SafeAreaView
      style={[containerStyles.fill, {backgroundColor: colors.white}]}>
      <HeaderBar>
        <HeaderBarText>Login</HeaderBarText>
      </HeaderBar>
      <View
        style={[
          containerStyles.fill,
          containerStyles.centeredContent,
          containerStyles.pageContainer,
        ]}>
        <Image
          style={[
            {
              width: '90%',
              maxHeight: '60%',
              resizeMode: 'contain',
            },
          ]}
          source={require('../assets/images/bp_passport.png')}
        />
        <View
          style={[
            {
              width: '80%',
            },
          ]}>
          <PageHeader style={{textAlign: 'center'}}>
            Scan your BP Passport card with your camera
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
          title={'Scan BP Passport'}
          onPress={() => {
            navigation.navigate(SCREENS.PRIVACY_POLICY)
          }}
        />
        <View
          style={[
            {
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16,
            },
          ]}>
          <Link>I don't have a BP Passport card</Link>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Login
