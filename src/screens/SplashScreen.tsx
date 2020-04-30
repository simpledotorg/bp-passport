import React, {useEffect} from 'react'
import {View, Image} from 'react-native'
import {FormattedMessage, useIntl} from 'react-intl'
import {StackNavigationProp} from '@react-navigation/stack'

import {containerStyles, colors, splashImage} from '../styles'
import {Button, PageHeader} from '../components'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.SPLASH
>

type Props = {
  navigation: SplashScreenNavigationProp
}

function SplashScreen({navigation}: Props) {
  const intl = useIntl()

  return (
    <View
      style={[
        containerStyles.fill,
        {
          backgroundColor: colors.grey4,
          justifyContent: 'flex-end',
        },
      ]}>
      <View
        style={[
          styles.splashContainer,
          {
            position: 'relative',
            height: '30%',
            justifyContent: 'center',
            flexDirection: 'row',
          },
        ]}>
        <Image
          source={splashImage}
          style={{position: 'absolute', bottom: '90%'}}
        />
        <View>
          <PageHeader
            style={{
              textAlign: 'center',
              marginBottom: 18,
              marginTop: '15%',
            }}>
            <FormattedMessage id="splash.track-bp-bs-meds" />
          </PageHeader>

          <Button
            style={[styles.primaryButton]}
            buttonColor={colors.blue2}
            title={intl.formatMessage({id: 'general.next'})}
            onPress={() => {
              navigation.navigate(SCREENS.LOGIN)
            }}
          />
        </View>
      </View>
    </View>
  )
}

export default SplashScreen

const styles = {
  splashContainer: {
    backgroundColor: colors.white100,
    borderRadius: 4,
    paddingHorizontal: 24,

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
