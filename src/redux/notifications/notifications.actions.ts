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
