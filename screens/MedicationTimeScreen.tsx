import React, { useState } from 'react'
import { View, TouchableWithoutFeedback, Platform } from 'react-native'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import DateTimePicker from '@react-native-community/datetimepicker'

import { containerStyles, colors } from '../styles'
import SCREENS from '../constants/screens'
import { RootStackParamList } from '../navigation/Navigation'
import { BodyHeader, Button, ButtonType } from '../components'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  dateForDayOffset,
  dayOffsetForDate,
} from '../redux/medication/medication.models'

type MedicineTimeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.MEDICATION_TIME
>

type MedicineTimeScreen = RouteProp<RootStackParamList, SCREENS.MEDICATION_TIME>

type Props = {
  navigation: MedicineTimeScreenNavigationProp
  route: MedicineTimeScreen
}

function MedicineTimeScreen({ navigation, route }: Props) {
  const intl = useIntl()
  const { updateDayOffset, reminder } = route.params
  const [date, setDate] = useState<Date>(
    dateForDayOffset(reminder.dayOffset) ?? new Date(),
  )

  if (Platform.OS === 'android') {
    return (
      <DateTimePicker
        value={date}
        mode={'time'}
        is24Hour={true}
        minuteInterval={5}
        display="clock"
        onTouchCancel={() => {
          navigation.goBack()
        }}
        onChange={(event, dateIn) => {
          if (event.type === 'dismissed') {
            navigation.goBack()
          } else {
            if (dateIn) {
              updateDayOffset(dayOffsetForDate(dateIn))
            }

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
      }}
    >
      <View
        style={[
          containerStyles.fill,
          { justifyContent: 'flex-end', backgroundColor: 'transparent' },
        ]}
      >
        <View
          style={{
            backgroundColor: colors.white100,
            width: '100%',
            padding: 16,
            flexShrink: 0,
          }}
        >
          <View
            style={{
              padding: 24,
              backgroundColor: colors.white100,
            }}
          >
            <View
              style={{
                borderBottomWidth: 1,
                borderColor: colors.grey3,
              }}
            >
              <BodyHeader
                style={{
                  fontWeight: 'bold',
                  fontSize: 22,
                  marginBottom: 16,
                }}
              >
                <FormattedMessage id="medicine.set-reminder-for" />
              </BodyHeader>
            </View>
            <View
              style={{
                borderBottomWidth: 1,
                borderColor: colors.grey3,
              }}
            >
              <DateTimePicker
                value={date}
                mode={'time'}
                minuteInterval={1}
                is24Hour={true}
                display="spinner"
                textColor="black"
                onChange={(event, dateIn) => {
                  if (dateIn) {
                    setDate(dateIn)
                  }
                }}
              />
            </View>
          </View>
          <Button
            buttonType={ButtonType.Normal}
            style={{ marginHorizontal: 16, marginBottom: 16 }}
            onPress={() => {
              updateDayOffset(dayOffsetForDate(date))
              setTimeout(() => {
                navigation.goBack()
              }, 0)
            }}
            title={intl.formatMessage({ id: 'general.save' })}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default MedicineTimeScreen
