import React, { useState, useRef } from 'react'
import { SafeAreaView, View, TextInput, StatusBar } from 'react-native'
import { FormattedMessage, useIntl } from 'react-intl'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import Modal from 'react-native-modal'

import { containerStyles, colors } from '../styles'
import {
  BodyText,
  Button,
  BodyHeader,
  LoadingOverlay,
  ButtonType,
} from '../components'
import SCREENS from '../constants/screens'
import { RootStackParamList } from '../navigation/Navigation'
import { useThunkDispatch } from '../redux/store'
import { login } from '../redux/auth/auth.actions'

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

function VerifyNumber({ route }: Props) {
  const dispatch = useThunkDispatch()

  const intl = useIntl()

  const inputRef = useRef<TextInput>(null)

  const [uiState, setUIState] = useState(UIState.Normal)
  const [error, setError] = useState<Error | undefined>(undefined)
  const [modalIsVisible, setModalIsVisible] = useState(false)
  const [input, setInput] = useState('')

  const { passport_id } = route.params

  const verifyOTP = (otp: string) => {
    inputRef?.current?.blur()
    if (uiState === UIState.Normal) {
      setUIState(UIState.CallingAPI)
      setModalIsVisible(true)
      return dispatch(login(passport_id, otp))
        .then(() => {
          // all good the app will take care of the rest
        })
        .catch((err: Error) => {
          setError(err)
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
        style={[containerStyles.fill, { backgroundColor: colors.white }]}
      >
        <StatusBar backgroundColor={colors.blue1} barStyle="light-content" />
        <View style={{ margin: 24 }}>
          <BodyText style={{ textAlign: 'center' }}>
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
            placeholder={intl.formatMessage({
              id: 'verify-pin.code',
            })}
            placeholderTextColor={colors.grey1}
            onChangeText={(text) => setInput(text)}
            value={input}
            keyboardType={'numeric'}
          />
          <Button
            style={[{ marginTop: 24 }]}
            buttonType={ButtonType.Normal}
            disabled={!input}
            onPress={() => {
              verifyOTP(input)
            }}
            title={intl.formatMessage({ id: 'general.verify' })}
          />
          {error && (
            <BodyHeader
              style={{
                fontSize: 16,
                color: colors.red1,
                textAlign: 'center',
                marginTop: 12,
              }}
            >
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
              }}
            >
              <FormattedMessage id="verify-pin.no-pin" />{' '}
              <BodyHeader style={{ color: colors.blue2 }}>
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
        }}
      >
        <LoadingOverlay />
      </Modal>
    </>
  )
}

export default VerifyNumber
