import { NotificationsActionTypes } from './notifications.types'
import { Permission } from './notifications.models'

export const setPushNotificationPermission = (permission: Permission) => ({
  type: NotificationsActionTypes.NOTIFICATIONS_SET_PUSH_NOTIFICATION_PERMISSION,
  payload: permission,
})

export const setDevicePushToken = (token?: string) => ({
  type: NotificationsActionTypes.NOTIFICATIONS_SET_DEVICE_PUSH_TOKEN,
  payload: token,
})
