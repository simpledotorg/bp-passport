import React, {useState} from 'react'
import {SafeAreaView, View, TextInput} from 'react-native'
import {FormattedMessage, useIntl, FormattedDate} from 'react-intl'

import {containerStyles, colors} from '../styles'
import {BodyText, Button, BodyHeader} from '../components'

function VerifyNumber({navigation}: any) {
  const intl = useIntl()

  const [input, setInput] = useState('')
  const [codeError, setCodeError] = useState(false)

  return (
    <View style={{flex: 1}}>
      <SafeAreaView
        style={[containerStyles.fill, {backgroundColor: colors.white}]}>
        <View style={{margin: 12}}>
          <BodyText style={{textAlign: 'center', marginTop: 12}}>
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
            onPress={() => {}}
            title={<FormattedMessage id="general.verify" />}
          />
        </View>
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
                <BodyHeader style={{color: colors.blue2}} onPress={() => {}}>
                  <FormattedMessage id="verify.resend" />
                </BodyHeader>
              ),
            }}
          />
        </BodyHeader>
      </SafeAreaView>
    </View>
  )
}

export default VerifyNumber
