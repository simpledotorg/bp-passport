import React, {useState} from 'react'
import {SafeAreaView, View, Image, Alert, ViewProps} from 'react-native'
import {FormattedMessage} from 'react-intl'
import {RNCamera, BarCodeType} from 'react-native-camera'
import {StackNavigationProp} from '@react-navigation/stack'
import AsyncStorage from '@react-native-community/async-storage'

import {containerStyles, qrImage, qrMaskImage, colors} from '../styles'
import {BodyHeader} from '../components'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'

type ScanScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.LAUNCH
>

type Props = {
  navigation: ScanScreenNavigationProp
}

type BarCodeRead = {
  data: string
  rawData?: string
  type: keyof BarCodeType
}

function ScanPassportScreen({navigation}: Props) {
  const [hasReadCode, setHasReadCode] = useState(false)

  const onBarCodeRead = (event: BarCodeRead) => {
    const udid: string | undefined = event.data
    if (!hasReadCode && udid) {
      setHasReadCode(true)
      try {
        AsyncStorage.setItem('token', udid).then((response) => {
          navigation.navigate(SCREENS.VERIFY_YOUR_NUMBER)
        })
      } catch (error) {
        console.log('Error saving UUID')
      }
    }
  }

  return (
    <SafeAreaView style={[containerStyles.fill]}>
      <View style={[containerStyles.fill]}>
        <View
          style={[
            containerStyles.pageContainer,
            {
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 24,
              paddingVertical: 20,
            },
          ]}>
          <Image
            style={{
              marginRight: 12,
              flexShrink: 0,
            }}
            source={qrImage}
          />
          <BodyHeader
            style={{
              fontSize: 20,
              flex: 1,
            }}>
            <FormattedMessage id="scan.qr-instruction" />
          </BodyHeader>
        </View>
        <View
          style={{
            flex: 1,
            overflow: 'hidden',
          }}>
          <RNCamera
            style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.off}
            captureAudio={false}
            androidCameraPermissionOptions={{
              title: 'Allow camera access?',
              message: 'BP Passport would like to access your camera',
              buttonPositive: 'Yes',
              buttonNegative: 'Cancel',
            }}
            barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
            onBarCodeRead={onBarCodeRead}
            notAuthorizedView={
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <BodyHeader
                  style={{
                    width: '80%',
                    textAlign: 'center',
                  }}>
                  <FormattedMessage id="scan.no-camera-permissions" />
                </BodyHeader>
              </View>
            }>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}>
              <View
                style={{
                  width: 200,
                  height: 200,
                }}>
                <Image
                  style={{width: '100%', height: '100%'}}
                  source={qrMaskImage}
                />
              </View>
            </View>
          </RNCamera>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default ScanPassportScreen
