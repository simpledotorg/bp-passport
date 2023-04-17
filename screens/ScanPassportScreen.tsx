import React, { useState, useEffect, useMemo } from 'react'
import { SafeAreaView, View, Image, Alert, StatusBar } from 'react-native'
import { FormattedMessage, useIntl } from 'react-intl'
import Modal from 'react-native-modal'
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner'
import { StackNavigationProp } from '@react-navigation/stack'
import { containerStyles, qrImage, qrMaskImage, colors } from '../styles'
import { BodyHeader, BodyText, LoadingOverlay } from '../components'
import SCREENS from '../constants/screens'
import { RootStackParamList } from '../navigation/Navigation'
import { useThunkDispatch } from '../redux/store'
import { activate } from '../redux/auth/auth.actions'
import { useIsFocused } from '@react-navigation/native'

type ScanScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.LAUNCH
>

type Props = {
  navigation: ScanScreenNavigationProp
}

// type BarCodeRead = {
//   data: string;
//   rawData?: string;
//   type: keyof BarCodeScanningResult;
// };

enum UIState {
  Normal,
  CallingAPI,
}

function ScanPassportScreen({ navigation }: Props) {
  const [uiState, setUIState] = useState(UIState.Normal)
  const [hasReadCode, setHasReadCode] = useState(false)
  const [error, setError] = useState<Error | undefined>(undefined)
  const [modalIsVisible, setModalIsVisible] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  const isFocused = useIsFocused()
  const intl = useIntl()

  const dispatch = useThunkDispatch()

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    }

    getBarCodeScannerPermissions()
  }, [])

  const onBarCodeRead = ({ type, data }: BarCodeScannerResult) => {
    if (!hasReadCode && type === BarCodeScanner.Constants.BarCodeType.qr) {
      setHasReadCode(true)
      setUIState(UIState.CallingAPI)
      setModalIsVisible(true)
      const passport_id = data

      return (
        // @ts-ignore
        dispatch(activate(passport_id))
          // @ts-ignore
          .then(() => {
            navigation.navigate(SCREENS.VERIFY_YOUR_NUMBER, {
              passport_id,
            })
          })
          .catch((err: Error) => {
            setError(err)
          })
          .finally(() => {
            setUIState(UIState.Normal)
            setModalIsVisible(false)
          })
      )
    }
  }

  useEffect(() => {
    if (error && !modalIsVisible && uiState === UIState.Normal) {
      setTimeout(() => {
        Alert.alert(
          intl.formatMessage({
            id: 'scan-bp-passport.cant-verify-account',
          }),
          intl.formatMessage({
            id: 'scan-bp-passport.dont-have-phone-number',
          }),
          [
            {
              text: 'OK',
              onPress: () => {
                setError(undefined)
                setHasReadCode(false)
              },
            },
          ],
          { cancelable: false },
        )
      }, 500)
    }
  }, [error, uiState, modalIsVisible])

  useEffect(() => {
    if (isFocused && hasReadCode) {
      // Just focused - eg. back button tapped - need to be able to rescan now
      setHasReadCode(false)
    }
  }, [isFocused])

  // test a working/not working code in the simulator

  /*

Working examples:

Ethiopia: 434bdbf8-d83e-47da-8299-65b1abd061ca

India: 8e53a061-dd75-4026-b7b4-69d42c365b46

*/

  // useEffect(() => {
  //   const good = 'gfdgfdgdf'
  //   const bad = 'fdsfds'
  //   onBarCodeRead({
  //     data: good,
  //     type: RNCamera.Constants.BarCodeType.qr,
  //   })
  // }, [])

  const noCameraAccess = useMemo(() => {
    return (
      <>
        <SafeAreaView style={[containerStyles.fill]}>
          <StatusBar backgroundColor={colors.blue1} barStyle="light-content" />
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
              ]}
            >
              <Image
                style={{
                  marginRight: 12,
                  flexShrink: 0,
                }}
                source={qrImage}
              />
              <BodyText
                style={{
                  fontSize: 18,
                  flex: 1,
                }}
              >
                <FormattedMessage id="scan-bp-passport.hold-camera" />
              </BodyText>
            </View>
            <View
              style={{
                flex: 1,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <BodyHeader
                  style={{
                    width: '80%',
                    textAlign: 'center',
                  }}
                >
                  <FormattedMessage id="login.allow-camera-access" />
                </BodyHeader>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </>
    )
  }, [])

  if (hasPermission === null) {
    return noCameraAccess
  }
  if (hasPermission === false) {
    return noCameraAccess
  }

  return (
    <>
      <SafeAreaView style={[containerStyles.fill]}>
        <StatusBar backgroundColor={colors.blue1} barStyle="light-content" />
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
            ]}
          >
            <Image
              style={{
                marginRight: 12,
                flexShrink: 0,
              }}
              source={qrImage}
            />
            <BodyText
              style={{
                fontSize: 18,
                flex: 1,
              }}
            >
              <FormattedMessage id="scan-bp-passport.hold-camera" />
            </BodyText>
          </View>
          <View
            style={{
              flex: 1,
              overflow: 'hidden',
            }}
          >
            <BarCodeScanner
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
              onBarCodeScanned={onBarCodeRead}
              barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
            >
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}
              >
                <View
                  style={{
                    width: 200,
                    height: 200,
                  }}
                >
                  <Image
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    source={qrMaskImage}
                  />
                </View>
              </View>
            </BarCodeScanner>
          </View>
        </View>
      </SafeAreaView>
      <Modal
        isVisible={modalIsVisible}
        style={{
          alignItems: 'center',
        }}
        onModalHide={() => {
          setModalIsVisible(false)
        }}
      >
        <LoadingOverlay />
      </Modal>
    </>
  )
}

export default ScanPassportScreen
