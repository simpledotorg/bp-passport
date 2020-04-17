import React, {useState, useContext, useRef} from 'react'
import {SafeAreaView, View, TextInput, Alert} from 'react-native'
import {FormattedMessage, useIntl} from 'react-intl'
import {StackNavigationProp} from '@react-navigation/stack'
import {RouteProp} from '@react-navigation/native'
import Modal from 'react-native-modal'

import {containerStyles, colors} from '../styles'
import {BodyText, Button, BodyHeader, LoadingOverlay} from '../components'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'
import {authActivate} from '../api'
import {AuthContext} from '../providers/auth.provider'

type VerifyNumberRouteProp = RouteProp<
  RootStackParamList,
  SCREENS.VERIFY_YOUR_NUMBER
>

type VerifyNumberScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.VERIFY_YOUR_NUMBER
>

type Props = {
  navigation: VerifyNumberScreenNavigationProp
  route: VerifyNumberRouteProp
}

enum UIState {
  Normal,
  CallingAPI,
}

function VerifyNumber({navigation, route}: Props) {
  const {setAuthParams} = useContext(AuthContext)
  const intl = useIntl()

  const inputRef = useRef<any>(null)

  const [uiState, setUIState] = useState(UIState.Normal)
  const [error, setError] = useState<Error | undefined>(undefined)
  const [modalIsVisible, setModalIsVisible] = useState(false)
  const [input, setInput] = useState('')

  const {passport_id} = route.params
  console.log('passport_id: ', passport_id)

  const verifyOTP = (otp: string) => {
    inputRef.current.blur()
    if (uiState === UIState.Normal) {
      setUIState(UIState.CallingAPI)
      setModalIsVisible(true)

      return authActivate({passport_id, otp})
        .then((authParams) => {
          if (authParams) {
            setAuthParams(authParams)
          }
        })
        .catch((error: Error) => {
          setError(error)
        })
        .finally(() => {
          setUIState(UIState.Normal)
          setModalIsVisible(false)
        })
    }
  }

  return (
    <>
      <SafeAreaView
        style={[containerStyles.fill, {backgroundColor: colors.white}]}>
        <View style={{margin: 24}}>
          <BodyText style={{textAlign: 'center'}}>
            <FormattedMessage id="verify-pin.please-verify" />
          </BodyText>
          <TextInput
            ref={inputRef}
            style={{
              width: '100%',
              height: 56,
              borderRadius: 4,
              backgroundColor: colors.white100,
              borderStyle: 'solid',
              borderWidth: 1,
              borderColor: colors.grey2,
              padding: 16,
              fontSize: 16,
              fontWeight: 'normal',
              fontStyle: 'normal',
              letterSpacing: 0.5,
              color: colors.grey0,
              marginTop: 36,
            }}
            placeholder={intl.formatMessage({id: 'verify-pin.code'})}
            onChangeText={(text) => setInput(text)}
            value={input}
            keyboardType={'numeric'}
          />
          <Button
            style={[{marginTop: 24}]}
            disabled={!input}
            onPress={() => {
              verifyOTP(input)
            }}
            title={intl.formatMessage({id: 'general.verify'})}
          />
          {error && (
            <BodyHeader
              style={{
                fontSize: 16,
                color: colors.red1,
                textAlign: 'center',
                marginTop: 12,
              }}>
              <FormattedMessage id="verify-pin.wrong-pin" />
            </BodyHeader>
          )}
          {error && (
            <BodyHeader
              style={{
                color: colors.grey1,
                width: '100%',
                textAlign: 'center',
                marginTop: 16,
              }}>
              <FormattedMessage id="verify-pin.no-pin" />{' '}
              <BodyHeader style={{color: colors.blue2}}>
                <FormattedMessage id="verify-pin.resend-sms-link" />
              </BodyHeader>
            </BodyHeader>
          )}
        </View>
      </SafeAreaView>

      <Modal
        isVisible={modalIsVisible}
        style={{
          alignItems: 'center',
        }}
        onModalHide={() => {
          setModalIsVisible(false)
        }}>
        <LoadingOverlay />
      </Modal>
    </>
  )
}

export default VerifyNumber
