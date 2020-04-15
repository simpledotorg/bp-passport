import React, {useState} from 'react'
import {SafeAreaView, View, TextInput} from 'react-native'
import {FormattedMessage, useIntl} from 'react-intl'
import {StackNavigationProp} from '@react-navigation/stack'
import {RouteProp} from '@react-navigation/native'

import {containerStyles, colors} from '../styles'
import {BodyText, Button, BodyHeader} from '../components'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'

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

function VerifyNumber({navigation, route}: Props) {
  const intl = useIntl()

  const [input, setInput] = useState('')
  const [codeError, setCodeError] = useState(false)

  const {passport_id} = route.params
  console.log('passport_id: ', passport_id)

  return (
    <View style={{flex: 1}}>
      <SafeAreaView
        style={[containerStyles.fill, {backgroundColor: colors.white}]}>
        <View style={{margin: 24}}>
          <BodyText style={{textAlign: 'center'}}>
            <FormattedMessage
              id="verify.verify-number"
              values={{
                number: (
                  <BodyText style={{fontWeight: 'bold'}}>
                    '+X XXX XXX XX14'
                  </BodyText>
                ),
              }}
            />
          </BodyText>
          <TextInput
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
            placeholder={intl.formatMessage({id: 'verify.verify-placeholder'})}
            onChangeText={(text) => setInput(text)}
            value={input}
            keyboardType={'numeric'}
          />
          <Button
            style={{marginTop: 24}}
            onPress={() => {
              navigation.navigate(SCREENS.HOME)
            }}
            title={intl.formatMessage({id: 'general.verify'})}
          />
          {codeError && (
            <BodyHeader
              style={{
                fontSize: 16,
                color: colors.red1,
                textAlign: 'center',
              }}>
              <FormattedMessage id="verify.incorrect-code" />
            </BodyHeader>
          )}
          <BodyHeader
            style={{
              color: colors.grey1,
              width: '100%',
              textAlign: 'center',
              marginTop: 16,
            }}>
            <FormattedMessage
              id="verify.didnt-receive"
              values={{
                resend: (
                  <BodyHeader style={{color: colors.blue2}}>
                    <FormattedMessage id="verify.resend" />
                  </BodyHeader>
                ),
              }}
            />
          </BodyHeader>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default VerifyNumber
