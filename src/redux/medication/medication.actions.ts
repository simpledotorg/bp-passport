import {MedicationActionTypes} from './medication.types'
import {Medication, Day, dayToKeyString, toDays} from './medication.models'
import {Platform} from 'react-native'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import PushNotificationAndroid from 'react-native-push-notification'
import {IntlShape} from 'react-intl'
import {format} from 'date-fns'
import {dateLocale} from '../../constants/languages'

export const mergeMedications = (medications: Medication[]) => ({
  type: MedicationActionTypes.MERGE_MEDICATIONS,
  payload: medications,
})

export const addMedication = (medication: Medication) => ({
  type: MedicationActionTypes.ADD_MEDICATION,
  payload: medication,
})

export const updateMedication = (medication: Medication) => ({
  type: MedicationActionTypes.UPDATE_MEDICATION,
  payload: medication,
})

export const deleteMedication = (bloodPressure: Medication) => ({
  type: MedicationActionTypes.DELETE_MEDICATION,
  payload: bloodPressure,
})

export const refreshAllLocalPushReminders = (
  medications: Medication[],
  intl: IntlShape,
) => {
  // console.log('refreshAllLocalPushReminders!')
  if (Platform.OS === 'ios') {
    PushNotificationIOS.removeAllPendingNotificationRequests()
  } else if (Platform.OS === 'android') {
    PushNotificationAndroid.cancelAllLocalNotifications()
  }

  const now = new Date().getTime()

  const oneDayMilliseconds = 24 * 60 * 60 * 1000

  medications.map((medication) => {
    const reminder = medication.reminder

    if (reminder) {
      const includedDays = toDays(reminder.days)
      if (includedDays.length) {
        let scheduledCount: number = 0
        for (let i = 0; i < 50; i++) {
          const midnight = new Date(
            new Date().getTime() + i * oneDayMilliseconds,
          )

          midnight.setHours(0, 0, 0, 0) // midnight in past

          const reminderTime = midnight.getTime() + reminder.dayOffset * 1000
          if (reminderTime < now) {
            // in past
            continue
          }

          const fireDate = new Date(reminderTime)

          const day: Day = fireDate.getDay()
          if (!includedDays.includes(day)) {
            continue
          }
          const dayString = intl.formatMessage({id: dayToKeyString(day, true)})
          const whenDay = `${dayString}`
          const whenTime = `${format(fireDate, 'h:mm a', {
            locale: dateLocale(),
          })}`

          const fireDateWithDLSavings = new Date(
            fireDate.getTime() + midnight.getTimezoneOffset() * -1,
          )

          const body = intl.formatMessage(
            {id: 'medicine.reminder-notification'},
            {day: whenDay, time: whenTime},
          )
          //console.log(body)
          if (Platform.OS === 'ios') {
            PushNotificationIOS.addNotificationRequest({
              id: `${fireDateWithDLSavings.getTime()}`,
              title: medication.name,
              body: body,
              fireDate: fireDateWithDLSavings,
            })
            // PushNotificationIOS.scheduleLocalNotification({
            //   alertTitle: medication.name,
            //   alertBody: body,
            //   fireDate: fireDateWithDLSavings.toISOString(),
            // })
          } else if (Platform.OS === 'android') {
            PushNotificationAndroid.localNotificationSchedule({
              date: fireDateWithDLSavings,
              channelId: 'bp-passport',
              allowWhileIdle: true,
              autoCancel: true, // (optional) default: true
              largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
              smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
              vibrate: true, // (optional) default: true
              vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
              ongoing: false, // (optional) set whether this is an "ongoing" notification

              title: medication.name, // (optional)
              message: body, // (required)
              playSound: true, // (optional) default: true
              soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
            })
          }
          scheduledCount++
          if (scheduledCount >= 15) {
            break
          }
        }
      }
    }
  })
}
