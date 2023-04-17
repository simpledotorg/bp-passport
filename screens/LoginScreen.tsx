import React from 'react'
import {
  SafeAreaView,
  View,
  Image,
  ScrollView,
  Linking,
  StatusBar,
  StyleSheet,
} from 'react-native'
import { FormattedMessage, useIntl } from 'react-intl'
import { StackNavigationProp } from '@react-navigation/stack'

import SCREENS from '../constants/screens'
import { containerStyles, colors, bpPassportImage } from '../styles'
import { Button, ButtonType, BodyText, BodyHeader } from '../components'
import { RootStackParamList } from '../navigation/Navigation'

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.LOGIN
>

type Props = {
  navigation: LoginScreenNavigationProp
}

function Login({ navigation }: Props) {
  const intl = useIntl()

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={colors.grey4} barStyle="dark-content" />
      <SafeAreaView
        style={[containerStyles.fill, { backgroundColor: colors.grey4 }]}
      >
        <StatusBar barStyle="dark-content" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          <View style={[{ marginTop: 18 }]}>
            <View style={[styles.loginContainer, { marginBottom: 10 }]}>
              <Image
                source={bpPassportImage}
                style={{ marginTop: 20, marginBottom: 20 }}
              />
              <BodyHeader style={{ textAlign: 'center', marginBottom: 22 }}>
                <FormattedMessage id="login.have-a-paper" />
              </BodyHeader>

              <Button
                style={[styles.primaryButton]}
                buttonType={ButtonType.LightBlue}
                title={intl.formatMessage({ id: 'login.scan-passport' })}
                onPress={() => {
                  navigation.navigate(SCREENS.SCAN_STACK)
                }}
              />
            </View>

            <View
              style={[
                styles.loginContainer,
                { marginBottom: 18, paddingTop: 23, paddingBottom: 27 },
              ]}
            >
              <BodyHeader style={{ textAlign: 'center', marginBottom: 18 }}>
                <FormattedMessage id="login.no-bp-passport" />
              </BodyHeader>
              <Button
                buttonType={ButtonType.Green}
                style={styles.primaryButton}
                title={intl.formatMessage({ id: 'login.get-started' })}
                onPress={() => {
                  navigation.navigate(SCREENS.CONSENT)
                }}
              />
            </View>

            <View style={[{ marginHorizontal: 50 }]}>
              <BodyText style={{ textAlign: 'center', marginBottom: 24 }}>
                <FormattedMessage
                  id="login.by-using-app"
                  values={{
                    privacy: (
                      <BodyText
                        style={{ color: colors.blue2 }}
                        onPress={() => {
                          Linking.openURL('https://simple.org/patient-privacy')
                        }}
                      >
                        <FormattedMessage id="login.privacy-policy-link" />
                      </BodyText>
                    ),
                    terms: (
                      <BodyText
                        style={{ color: colors.blue2 }}
                        onPress={() => {
                          Linking.openURL(
                            'https://simple.org/digitalprinciples/',
                          )
                        }}
                      >
                        <FormattedMessage id="login.terms-of-use-link" />
                      </BodyText>
                    ),
                  }}
                />
              </BodyText>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  loginContainer: {
    backgroundColor: colors.white100,
    borderRadius: 4,
    marginHorizontal: 18,
    marginBottom: 8,
    flexShrink: 0,
    padding: 24,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 5,
  },
  primaryButton: {
    width: '100%',
  },
})
