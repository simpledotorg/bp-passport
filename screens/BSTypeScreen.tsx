import React, { useState } from 'react'
import {
  View,
  TouchableWithoutFeedback,
  TouchableHighlight,
} from 'react-native'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { containerStyles, colors } from '../styles'
import SCREENS from '../constants/screens'
import { RootStackParamList } from '../navigation/Navigation'
import { BodyHeader, BodyText } from '../components'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  BLOOD_SUGAR_TYPES_ORDERED,
  bloodSugarTypeToInfo,
} from '../redux/blood-sugar/blood-sugar.models'
import { RadioButton } from '../components/checkbox'

type ScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.BS_TYPE
>

type Route = RouteProp<RootStackParamList, SCREENS.BS_TYPE>

type Props = {
  navigation: ScreenNavigationProp
  route: Route
}

function BPTypeScreen({ navigation, route }: Props) {
  const intl = useIntl()
  const { updateType } = route.params
  const [type, setType] = useState(route.params.type)

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.goBack()
      }}
    >
      <View
        style={[
          containerStyles.fill,
          { justifyContent: 'flex-end', backgroundColor: 'transparent' },
        ]}
      >
        <TouchableWithoutFeedback>
          <View
            style={{
              backgroundColor: colors.white100,
              width: '100%',
              padding: 16,
              flexShrink: 0,
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
            }}
          >
            <View
              style={{
                padding: 24,
                backgroundColor: colors.white100,
              }}
            >
              <View style={{}}>
                <BodyHeader
                  style={{
                    fontWeight: 'bold',
                    fontSize: 22,
                    marginBottom: 16,
                  }}
                >
                  <FormattedMessage id="bs.blood-sugar-type" />
                </BodyHeader>
              </View>
              {BLOOD_SUGAR_TYPES_ORDERED.map((t) => {
                const info = bloodSugarTypeToInfo(t, intl)
                return (
                  <TouchableHighlight
                    underlayColor={colors.white}
                    key={info.type}
                    onPress={() => {
                      setType(info.type)
                      setTimeout(() => {
                        updateType(info.type)
                        navigation.goBack()
                      }, 200)
                    }}
                  >
                    <View
                      style={{
                        paddingVertical: 14,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <RadioButton checked={info.type === type} />
                      <View style={{ marginLeft: 16 }}>
                        <BodyText
                          style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            lineHeight: 22,
                            color: colors.black0,
                          }}
                        >
                          {info.title}
                        </BodyText>
                        <BodyText
                          style={{
                            fontSize: 16,
                            lineHeight: 22,
                            color: colors.black0,
                          }}
                        >
                          {info.subtitle}
                        </BodyText>
                      </View>
                    </View>
                  </TouchableHighlight>
                )
              })}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default BPTypeScreen
