import React, {useState, useRef, ReactChild, ReactNode, useEffect} from 'react'
import {
  SafeAreaView,
  View,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {FormattedMessage, useIntl} from 'react-intl'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {format} from 'date-fns'

import {containerStyles, colors} from '../styles'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'

import {useThunkDispatch} from '../redux/store'
import {BodyText, BodyHeader, Button} from '../components'
import {medicationsLibrarySelector} from '../redux/medication/medication.selectors'
import PushNotifications, {scheduleNotif} from '../notifications'
import {
  createAReminder,
  DAILY,
  WEEK_DAYS,
  WEEKENDS,
  Day,
  frequencyText,
  dateForDayOffset,
} from '../redux/medication/medication.models'

type MedicationDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.MEDICATION_DETAILS
>

type MedicationDetailsScreen = RouteProp<
  RootStackParamList,
  SCREENS.MEDICATION_DETAILS
>

type Props = {
  navigation: MedicationDetailsScreenNavigationProp
  route: MedicationDetailsScreen
}

function Row({children}: {children: ReactNode}) {
  return <View style={styles.row}>{children}</View>
}

function MedicationDetailsScreen({navigation, route}: Props) {
  const intl = useIntl()
  const [remindersEnabled, setRemindersEnabled] = useState(
    route.params.medication.reminder !== undefined,
  )

  const [recurringReminders, setRecurringReminders] = useState(false)
  const [medication, setMedication] = useState(route.params.medication)
  const [reminder, setReminder] = useState(
    route.params.medication.reminder ?? createAReminder(),
  )

  const updateDays = (days: string) => {
    setReminder({...reminder, days})
  }

  const updateDayOffset = (dayOffset: number) => {
    setReminder({...reminder, dayOffset})
  }

  const reminderDate = dateForDayOffset(reminder.dayOffset)

  useEffect(() => {
    if (remindersEnabled) {
      if (Platform.OS === 'ios') {
        PushNotifications.requestPermissions((permissions) => {
          console.log('Permissions completed on iOS: ', permissions)
          scheduleNotif()
        })
      } else {
        console.log('on android so no permissions required')
        scheduleNotif()
      }
    }
  }, [remindersEnabled])

  return (
    <SafeAreaView style={[containerStyles.fill]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[containerStyles.containerSegment]}>
          <Row>
            <BodyHeader>
              <FormattedMessage id="medicine.reminder" />
            </BodyHeader>
            <Switch
              trackColor={{false: colors.grey4, true: colors.blue3}}
              thumbColor={remindersEnabled ? colors.blue2 : colors.grey3}
              onValueChange={() => {
                setRemindersEnabled(!remindersEnabled)
              }}
              value={remindersEnabled}
            />
          </Row>
          {remindersEnabled && (
            <>
              <TouchableWithoutFeedback
                onPress={() => {
                  navigation.navigate(SCREENS.MEDICATION_FREQUENCY, {
                    updateDays,
                    reminder,
                  })
                }}>
                <View
                  style={[
                    styles.row,
                    {
                      borderBottomWidth: 2,
                      borderColor: colors.grey4,
                      paddingVertical: 12,
                    },
                  ]}>
                  <BodyText>
                    <FormattedMessage id="medicine.frequency" />
                  </BodyText>
                  <View style={{flexDirection: 'row'}}>
                    <BodyText style={{color: colors.blue2, marginRight: 16}}>
                      <FormattedMessage id={frequencyText(reminder.days)} />
                    </BodyText>
                    <Icon
                      name="chevron-right"
                      size={24}
                      style={{marginLeft: 'auto'}}
                      color={colors.blue2}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => {
                  navigation.navigate(SCREENS.MEDICATION_TIME, {
                    updateDayOffset,
                    reminder,
                  })
                }}>
                <View
                  style={[
                    styles.row,
                    {
                      paddingTop: 12,
                    },
                  ]}>
                  <BodyText>
                    <FormattedMessage id="medicine.time" />
                  </BodyText>
                  <View style={{flexDirection: 'row'}}>
                    <BodyText style={{color: colors.blue2, marginRight: 16}}>
                      {format(reminderDate, 'h:mm a')}
                    </BodyText>
                    <Icon
                      name="chevron-right"
                      size={24}
                      style={{marginLeft: 'auto'}}
                      color={colors.blue2}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </>
          )}
        </View>
        <View style={[containerStyles.containerSegment]}>
          <Row>
            <BodyHeader>
              <FormattedMessage id="medicine.recurring-reminders" />
            </BodyHeader>
            <Switch
              trackColor={{false: colors.grey4, true: colors.blue3}}
              thumbColor={recurringReminders ? colors.blue2 : colors.grey3}
              onValueChange={() => {
                setRecurringReminders(!recurringReminders)
              }}
              value={recurringReminders}
            />
          </Row>
          <BodyText style={{color: colors.grey1, fontSize: 16, marginTop: 18}}>
            <FormattedMessage id="medicine.will-be-reminded" />
          </BodyText>
        </View>
        <Button
          style={{marginHorizontal: 8, marginTop: 'auto'}}
          title={intl.formatMessage({id: 'general.save'})}
          onPress={() => {}}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default MedicationDetailsScreen

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 8,
    flex: 1,
  },
  row: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
