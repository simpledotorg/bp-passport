import React, {useEffect, useState} from 'react'
import {
  View,
  Image,
  StatusBar,
  TouchableWithoutFeedback,
  TouchableHighlight,
} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'

import {containerStyles, colors} from '../styles'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'
import {BodyHeader, BodyText, CheckBox, Button, ButtonType} from '../components'
import {FormattedMessage, IntlContext, useIntl} from 'react-intl'
import {
  Day,
  ALL_DAYS_ORDERED,
  dayToKeyString,
  ordedDays,
} from '../redux/medication/medication.models'

type MedicineFrequencyScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.MEDICATION_FREQUENCY
>

type MedicineFrequencyScreen = RouteProp<
  RootStackParamList,
  SCREENS.MEDICATION_FREQUENCY
>

type Props = {
  navigation: MedicineFrequencyScreenNavigationProp
  route: MedicineFrequencyScreen
}

function MedicineFrequencyScreen({navigation, route}: Props) {
  const intl = useIntl()
  const {updateDays, reminder} = route.params
  const [days, setDays] = useState(
    reminder.days.split('').map((s) => Number(s) as Day),
  )

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.goBack()
      }}>
      <View
        style={[
          containerStyles.fill,
          {justifyContent: 'flex-end', backgroundColor: 'transparent'},
        ]}>
        <View
          style={{
            backgroundColor: colors.white100,
            width: '100%',
            padding: 16,
            flexShrink: 0,
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }}>
          <View
            style={{
              padding: 24,
              backgroundColor: colors.white100,
            }}>
            <View
              style={{
                borderBottomWidth: 2,
                borderColor: colors.grey3,
              }}>
              <BodyHeader
                style={{
                  fontWeight: 'bold',
                  fontSize: 22,
                  marginBottom: 16,
                }}>
                <FormattedMessage id="medicine.set-reminder-for" />
              </BodyHeader>
            </View>
            {ALL_DAYS_ORDERED.map((day, index) => {
              return (
                <TouchableHighlight
                  underlayColor={colors.grey4}
                  key={day}
                  onPress={() => {
                    const clone = [...days]
                    const wasSelected = clone.includes(day)
                    if (wasSelected) {
                      clone.splice(days.indexOf(day), 1)
                    } else {
                      clone.push(day)
                    }
                    setDays(clone)
                  }}>
                  <View
                    style={{
                      borderBottomWidth:
                        index === ALL_DAYS_ORDERED.length - 1 ? 0 : 1,
                      borderColor: colors.grey3,
                      paddingVertical: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <CheckBox checked={days.includes(day)} />
                    <BodyText
                      style={{
                        fontSize: 16,
                        lineHeight: 24,
                        letterSpacing: 0.5,
                        color: colors.grey1,
                        marginLeft: 12,
                      }}>
                      <FormattedMessage id={dayToKeyString(day)} />
                    </BodyText>
                  </View>
                </TouchableHighlight>
              )
            })}
          </View>
          <Button
            buttonType={ButtonType.Normal}
            style={{marginHorizontal: 16, marginBottom: 16}}
            disabled={!days.length}
            onPress={() => {
              updateDays(ordedDays(days))
              navigation.goBack()
            }}
            title={intl.formatMessage({id: 'general.save'})}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default MedicineFrequencyScreen
