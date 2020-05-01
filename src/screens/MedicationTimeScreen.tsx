import React, {useState} from 'react'
import {View, TouchableWithoutFeedback, Platform} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import DateTimePicker from '@react-native-community/datetimepicker'

import {containerStyles, colors} from '../styles'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'
import {BodyHeader, BodyText, CheckBox, Button} from '../components'
import {FormattedMessage, IntlContext, useIntl} from 'react-intl'

type MedicineTimeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.MEDICATION_TIME
>

type MedicineTimeScreen = RouteProp<RootStackParamList, SCREENS.MEDICATION_TIME>

type Props = {
  navigation: MedicineTimeScreenNavigationProp
  route: MedicineTimeScreen
}

function MedicineTimeScreen({navigation, route}: Props) {
  const intl = useIntl()
  const {updateTime, medication} = route.params
  const [time, setTime] = useState<Date>(medication.time ?? new Date())

  if (Platform.OS === 'android') {
    return (
      <DateTimePicker
        value={time}
        mode={'time'}
        is24Hour={true}
        display="clock"
        onTouchCancel={() => {
          navigation.goBack()
        }}
        onChange={(event, date) => {
          console.log(event.type)
          if (event.type === 'neutralButtonPressed') {
            setTime(date)
            navigation.goBack()
          }
        }}
      />
    )
  }

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
            <DateTimePicker
              value={time}
              mode={'time'}
              is24Hour={true}
              display="clock"
              onChange={(event, date) => {
                setTime(date)
              }}
            />
          </View>
          <Button
            style={{marginHorizontal: 16, marginBottom: 16}}
            onPress={() => {
              updateTime(time)
              setTimeout(() => {
                navigation.goBack()
              }, 0)
            }}
            title={intl.formatMessage({id: 'general.save'})}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default MedicineTimeScreen
