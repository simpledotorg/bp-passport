import React, {useState} from 'react'
import {SafeAreaView, View, Image, Alert, TouchableOpacity} from 'react-native'
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
        style={[containerStyles.fill, {backgroundColor: colors.white}]}>
        <View
          style={[
            containerStyles.fill,
            containerStyles.centeredContent,
            containerStyles.pageContainer,
          ]}>
          <Image source={bpPassportImage} />
          <View
            style={[
              {
                width: '80%',
              },
            ]}>
            <PageHeader style={{textAlign: 'center'}}>
              <FormattedMessage id="login.scan-your-passport" />
            </PageHeader>
          </View>
        </View>
        <View
          style={[
            {
              margin: 12,
            },
          ]}>
          <Button
            title={intl.formatMessage({id: 'page-titles.scan-bp-passport'})}
            onPress={() => {
              navigation.navigate(SCREENS.SCAN_BP_PASSPORT)
            }}
          />
          <TouchableOpacity
            style={[
              {
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 12,
                padding: 4,
              },
            ]}
            onPress={() => {
              Alert.alert(
                intl.formatMessage({id: 'login.update-coming-soon'}),
                intl.formatMessage({id: 'login.try-again'}),
                [
                  {
                    text: intl.formatMessage({id: 'general.ok'}),
                  },
                ],
              )
            }}>
            <Link>
              <FormattedMessage id="login.no-passport-link" />
            </Link>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default Login
