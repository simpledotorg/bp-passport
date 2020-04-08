import React, {useState, useRef} from 'react'
import {SafeAreaView, View, Image} from 'react-native'
import {FormattedMessage} from 'react-intl'
import Modal from 'react-native-modal'
import {RNCamera, CameraStatus} from 'react-native-camera'

import SCREENS from '../constants/screens'
import {containerStyles, colors, bpPassportImage} from '../styles'
import {Button, Link, PageHeader, BodyText, BodyHeader} from '../components'

function VerifyNumber({navigation}: any) {
  return (
    <View style={{flex: 1}}>
      <SafeAreaView
        style={[containerStyles.fill, {backgroundColor: colors.white}]}>
        <BodyText>Hello</BodyText>
      </SafeAreaView>
    </View>
  )
}

export default VerifyNumber
