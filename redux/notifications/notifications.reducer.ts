import { AnyAction } from 'redux'

import { NotificationsActionTypes } from './notifications.types'
import { Permission } from './notifications.models'

const INITIAL_STATE: {
  pushNotificationPermission: Permission
  devicePushToken?: string
} = {
  pushNotificationPermission: Permission.PermissionNotDetermined,
  devicePushToken: undefined,
}

const reducer = (state = INITIAL_STATE, action: AnyAction) => {
  switch (action.type) {
    case NotificationsActionTypes.NOTIFICATIONS_SET_PUSH_NOTIFICATION_PERMISSION:
      return {
        ...state,
        pushNotificationPermission: action.payload,
      }
    case NotificationsActionTypes.NOTIFICATIONS_SET_DEVICE_PUSH_TOKEN:
      return {
        ...state,
        devicePushToken: action.payload,
      }

    default:
      return state
  }
}

export default reducer
