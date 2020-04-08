import React, {useRef, useState} from 'react'
import {SafeAreaView, View, Image, Alert} from 'react-native'
import {FormattedMessage} from 'react-intl'
import {RNCamera} from 'react-native-camera'

import {containerStyles, qrImage, qrMaskImage, colors} from '../styles'
import {BodyHeader} from '../components'
import SCREENS from '../constants/screens'

function ScanPassportScreen({navigation}: any) {
  const camera: null | {current: any} = useRef(null)

  const [hasReadCode, setHasReadCode] = useState(false)

  const onBarCodeRead = (event: any) => {
    const udid: string | undefined = event.data
    if (!hasReadCode && udid) {
      setHasReadCode(true)
      Alert.alert(
        'QR UDID',
        `${udid}\n\nTodo - integrate with API`,
        [{text: 'OK', onPress: () => navigation.replace(SCREENS.HOME)}],
        {cancelable: false},
      )
    }
  }

  return (
    <SafeAreaView style={[containerStyles.fill]}>
      <View style={[containerStyles.fill, containerStyles.centeredContent]}>
        <View
          style={[
            containerStyles.pageContainer,
            {
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 0,
              width: '100%',
              marginTop: 12,
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
              flexWrap: 'wrap',
            }}>
            <FormattedMessage id="scan.qr-instruction" />
          </BodyHeader>
        </View>
        <View
          style={{
            flex: 1,
            width: '100%',
            marginTop: 12,
            overflow: 'hidden',
          }}>
          <RNCamera
            ref={camera}
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
