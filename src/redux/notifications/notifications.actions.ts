import {NotificationsActionTypes} from './notifications.types'
import {Permission} from './notifications.models'
import {Platform} from 'react-native'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import PushNotificationAndroid from 'react-native-push-notification'

export const setPushNotificationPermission = (permission: Permission) => ({
  type: NotificationsActionTypes.NOTIFICATIONS_SET_PUSH_NOTIFICATION_PERMISSION,
  payload: permission,
})

export const setDevicePushToken = (token?: string) => ({
  type: NotificationsActionTypes.NOTIFICATIONS_SET_DEVICE_PUSH_TOKEN,
  payload: token,
})

export const testPush = () => {
  if (Platform.OS === 'ios') {
    PushNotificationIOS.presentLocalNotification({
      alertTitle: 'A Local Push',
      alertBody: 'Your Push Text!',
    })
  } else if (Platform.OS === 'android') {
    PushNotificationAndroid.presentLocalNotification({
      autoCancel: true, // (optional) default: true
      largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
      smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      ongoing: false, // (optional) set whether this is an "ongoing" notification

      title: 'A Local Push', // (optional)
      message: 'Your Push Text!', // (required)
      playSound: true, // (optional) default: true
      soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
    })
  }
}
/*
export const scheduleReminders = () => {
  const id: string = 'reminder'
  const exampleReminder: Reminder = {id, active: true, dayOffset: 60 * 60 * 8}

  let midnight = new Date()
  midnight.setHours(0, 0, 0, 0) // midnight in past
  let eightAm = midnight.getTime() + exampleReminder.dayOffset * 1000
  if (eightAm < new Date().getTime()) {
    // in past
    eightAm += 60 * 60 * 1000 * 24
  }
  for (let i = 0; i < 50; i++) {
    const fireDate = new Date(eightAm)
    if (Platform.OS === 'ios') {
      PushNotificationIOS.scheduleLocalNotification({
        alertTitle: 'Reminder',
        alertBody: 'Your Reminder Text!',
        fireDate: fireDate.toISOString(),
      })
    } else if (Platform.OS === 'android') {
      PushNotificationAndroid.localNotificationSchedule({
        date: fireDate,
        autoCancel: true, // (optional) default: true
        largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
        smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
        vibrate: true, // (optional) default: true
        vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        ongoing: false, // (optional) set whether this is an "ongoing" notification

        title: 'Reminder', // (optional)
        message: 'Your Reminder Text!', // (required)
        playSound: true, // (optional) default: true
        soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      })
    }

    eightAm += 60 * 60 * 1000 * 24
  }

  return {
    type: NotificationsActionTypes.NOTIFICATIONS_SET_REMINDERS,
    payload: [exampleReminder],
  }
}

export const unscheduleReminders = () => {
  if (Platform.OS === 'ios') {
    PushNotificationIOS.cancelAllLocalNotifications()
  } else if (Platform.OS === 'android') {
    PushNotificationAndroid.cancelAllLocalNotifications()
  }
  return {
    type: NotificationsActionTypes.NOTIFICATIONS_SET_REMINDERS,
    payload: [],
  }
}

*/
