import React, {useState} from 'react'
import {
  SafeAreaView,
  View,
  Image,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native'
import {FormattedMessage, useIntl} from 'react-intl'
import Modal from 'react-native-modal'
import {StackNavigationProp} from '@react-navigation/stack'

import SCREENS from '../constants/screens'
import {containerStyles, colors, bpPassportImage} from '../styles'
import {Button, Link, PageHeader, BodyText, BodyHeader} from '../components'
import {RootStackParamList} from '../Navigation'

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.LOGIN
>

type Props = {
  navigation: LoginScreenNavigationProp
}

function Login({navigation}: Props) {
  const intl = useIntl()
  const [showNoBpPassportModal, setShowNoBpPassportModal] = useState(false)

  return (
    <View style={{flex: 1}}>
      <SafeAreaView
        style={[containerStyles.fill, {backgroundColor: colors.grey4}]}>
        <View style={[containerStyles.fill, {marginTop: 40}]}>
          <View style={[styles.loginContainer, {marginBottom: 10}]}>
            <Image source={bpPassportImage} />
            <PageHeader style={{textAlign: 'center', marginBottom: 22}}>
              <FormattedMessage id="login.have-a-paper" />
            </PageHeader>

            <Button
              style={[styles.primaryButton]}
              buttonColor={colors.blue2}
              title={intl.formatMessage({id: 'login.scan-passport'})}
              onPress={() => {
                navigation.navigate(SCREENS.SCAN_BP_PASSPORT)
              }}
            />
          </View>

          <View style={[styles.loginContainer, {marginBottom: 18}]}>
            <PageHeader style={{textAlign: 'center', marginBottom: 18}}>
              <FormattedMessage id="login.no-bp-passport" />
            </PageHeader>
            <Button
              style={{
                backgroundColor: colors.green1,
                width: '100%',
              }}
              title={intl.formatMessage({id: 'login.get-started'})}
              onPress={() => {}}
            />
          </View>

          <View style={[{marginHorizontal: 24}]}>
            <BodyText>
              <FormattedMessage id="login.by-using-app" />{' '}
              <BodyText style={{marginBottom: 24}}>
                <BodyText
                  style={{color: colors.blue2}}
                  onPress={() => {
                    Linking.openURL('https://simple.org/patient-privacy')
                  }}>
                  <FormattedMessage id="login.privacy-policy-link" />{' '}
                </BodyText>
                <BodyText>
                  <FormattedMessage id="general.and" />{' '}
                </BodyText>
                <BodyText
                  style={{color: colors.blue2}}
                  onPress={() => {
                    Linking.openURL('https://simple.org/digitalprinciples/')
                  }}>
                  <FormattedMessage id="login.terms-of-use-link" />
                </BodyText>
                <BodyText>.</BodyText>
              </BodyText>
            </BodyText>
          </View>
        </View>
        <View
          style={[
            {
              margin: 12,
            },
          ]}
        />
      </SafeAreaView>
    </View>
  )
}

export default Login

const styles = {
  loginContainer: {
    backgroundColor: colors.white100,
    borderRadius: 4,
    marginHorizontal: 8,
    marginBottom: 8,
    flexShrink: 0,
    padding: 24,
    alignItems: 'center',

    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  primaryButton: {
    backgroundColor: colors.blue3,
    shadowColor: 'rgba(0, 117, 235, 0.3)',
    width: '100%',
  },
}
