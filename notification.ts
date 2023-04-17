import { useEffect, useRef } from 'react'
import { Platform } from 'react-native'
import * as Notifications from 'expo-notifications'

export default function Notification() {
  const notificationListener = useRef()
  const responseListener = useRef()

  useEffect(() => {
    const notificationListenerCurrent = notificationListener.current
    const responseListenerCurrent = responseListener.current
    return () => {
      Notifications.removeNotificationSubscription(notificationListenerCurrent)
      Notifications.removeNotificationSubscription(responseListenerCurrent)
    }
  }, [])

  return null
}

export async function schedulePushNotification(
  weekday: number,
  hour: number,
  minute: number,
  medication: string,
  body: string,
) {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: medication,
      body: body,
      priority: 'high',
      sound: Platform.OS === 'android' ? undefined : 'default',
    },
    trigger: { weekday: weekday, hour: hour, minute: minute, repeats: true },
  })

  console.log('notif id on scheduling', id)
  return id
}

export async function cancelNotification(notifId: string) {
  await Notifications.cancelScheduledNotificationAsync(notifId)
}
