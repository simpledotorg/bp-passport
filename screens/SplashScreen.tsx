import React, { useEffect, useState } from 'react'
import { View, Image, Dimensions } from 'react-native'
import { FormattedMessage, useIntl } from 'react-intl'
import { StackNavigationProp } from '@react-navigation/stack'

import { containerStyles, colors, splashImage } from '../styles'
import { Button, BodyHeader, ButtonType } from '../components'
import SCREENS from '../constants/screens'
import { RootStackParamList } from '../navigation/Navigation'

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.SPLASH
>

type Props = {
  navigation: SplashScreenNavigationProp
}

function SplashScreen({ navigation }: Props) {
  const intl = useIntl()

  const [bottomContentHeight, setBottomContentHeight] = useState(0)
  const [imageHeightToWidthRatio, setImageHeightToWidthRatio] = useState(1)

  useEffect(() => {
    const image = Image.resolveAssetSource(splashImage)
    setImageHeightToWidthRatio(image.width / image.height)
  }, [])

  const maxImageHeight = 475
  const imageHeight = Math.min(
    Dimensions.get('window').height - (bottomContentHeight - 32 + 92),
    maxImageHeight,
  )
  const imageWidth = imageHeight * imageHeightToWidthRatio

  return (
    <View
      style={[
        containerStyles.fill,
        {
          backgroundColor: colors.grey4,
          flexDirection: 'column-reverse',
        },
      ]}
    >
      <View
        style={[
          styles.splashContainer,
          {
            justifyContent: 'center',
            flexDirection: 'row',
            paddingTop: 56,
            paddingBottom: 32,
          },
        ]}
        onLayout={(event) => {
          setBottomContentHeight(event.nativeEvent.layout.height)
        }}
      >
        <View style={{ flex: 1 }}>
          <BodyHeader
            style={{
              textAlign: 'center',
              marginBottom: 24,
            }}
          >
            <FormattedMessage id="splash.track-bp-bs-meds" />
          </BodyHeader>

          <Button
            style={[styles.primaryButton]}
            buttonType={ButtonType.LightBlue}
            title={intl.formatMessage({ id: 'general.next' })}
            onPress={() => {
              navigation.navigate(SCREENS.LOGIN)
            }}
          />
        </View>
        <Image
          resizeMode={'stretch'}
          source={splashImage}
          style={{
            position: 'absolute',
            bottom: bottomContentHeight - 32,
            height: imageHeight,
            width: imageWidth,
          }}
        />
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
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 5,
  },
  primaryButton: {
    backgroundColor: colors.blue3,
    shadowColor: 'rgba(0, 117, 235, 0.3)',
    width: '100%',
  },
}
